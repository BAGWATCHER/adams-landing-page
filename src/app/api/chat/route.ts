import { NextResponse } from "next/server";
import { GoogleGenerativeAI, type Content } from "@google/generative-ai";
import { appendLead, type Lead } from "./leadStore";

function sse(
  res: ReadableStreamDefaultController<Uint8Array>,
  event: string,
  data: any
) {
  const enc = new TextEncoder();
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  res.enqueue(enc.encode(payload));
}

type Msg = { role: "user" | "assistant"; content: string };

type Route = {
  agent: "sales" | "strategy" | "technical" | "onboarding";
  reason: string;
};

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const genAI = new GoogleGenerativeAI(mustEnv("GEMINI_API_KEY"));
const MODEL = process.env.GEMINI_MODEL || "gemini-3-flash-preview";

const ADAM_KB = `
You are Adam’s Assistant — an AI agent for Adam Normandin (a human) and his AI company.

PRIMARY GOAL:
- Qualify inbound leads and help them articulate their workflow.
- Collect enough detail for Adam to decide if it’s a fit and what to propose.
- Convert to a next step: usually call/text Adam at (603) 748-4982.

POSITIONING:
- Adam is CRO @ Vector Data.
- He stays close to new model capabilities and turns them into shippable, agent-powered workflows.
- Typical engagement: discovery → roadmap → prototype → production/handoff.

HARD RULES:
- Don’t claim Adam is currently in the chat.
- Don’t promise fixed pricing/timelines/deliverables.
- Don’t request secrets (passwords, API keys, private keys, PHI).
- Prefer 1 question at a time.

SOFT CAPTURE:
- Don’t require email. If needed, ask for a phone number for follow-up.

CONTACT CTA:
- If they’re serious or time-sensitive: “Call/text Adam at (603) 748-4982.”
`;

async function geminiText(system: string, messages: Msg[]): Promise<string> {
  const model = genAI.getGenerativeModel({ model: MODEL });

  const contents: Content[] = [];
  contents.push({ role: "user", parts: [{ text: `${system}\n\n${ADAM_KB}` }] });

  for (const m of messages) {
    contents.push({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    });
  }

  const result = await model.generateContent({ contents });
  return result.response.text().trim();
}

async function geminiStream(
  system: string,
  messages: Msg[],
  onDelta: (t: string) => void
): Promise<void> {
  const model = genAI.getGenerativeModel({ model: MODEL });

  const contents: Content[] = [];
  contents.push({ role: "user", parts: [{ text: `${system}\n\n${ADAM_KB}` }] });
  for (const m of messages) {
    contents.push({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    });
  }

  const result: any = await (model as any).generateContentStream({ contents });
  for await (const chunk of result.stream) {
    const t = chunk?.text?.() ?? chunk?.toString?.() ?? "";
    if (t) onDelta(String(t));
  }
}

function extractContact(text: string): {
  phone?: string;
  email?: string;
  company?: string;
  name?: string;
} {
  const out: any = {};
  const phone = text.match(/(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/)?.[0];
  if (phone) out.phone = phone;
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
  if (email) out.email = email;

  for (const key of ["name", "company"]) {
    const re = new RegExp(`(?:^|\n)\\s*${key}\\s*[:=-]\\s*(.+)`, "i");
    const m = text.match(re);
    if (m?.[1]) out[key] = m[1].trim();
  }

  return out;
}

async function routeIntent(messages: Msg[]): Promise<Route> {
  const last =
    messages.slice().reverse().find((m) => m.role === "user")?.content ?? "";

  const routerSystem = `
You are a router for a multi-agent business assistant. Output ONLY valid JSON with keys:
- agent: one of ["sales","strategy","technical","onboarding"]
- reason: short reason
Choose:
- sales: pricing, budget, ROI, objections, scheduling
- strategy: process/workflow, use cases, prioritization
- technical: integrations, data, security, architecture
- onboarding: how to start, project plan, timeline shape
`;

  const txt = await geminiText(routerSystem, [{ role: "user", content: last }]);

  try {
    const parsed = JSON.parse(txt) as Route;
    if (!parsed?.agent || !parsed.reason) throw new Error("bad route");
    if (![
      "sales",
      "strategy",
      "technical",
      "onboarding",
    ].includes(parsed.agent))
      throw new Error("bad agent");
    return parsed;
  } catch {
    const l = last.toLowerCase();
    if (l.includes("price") || l.includes("cost") || l.includes("budget")) {
      return { agent: "sales", reason: "heuristic: pricing/budget" };
    }
    if (l.includes("integr") || l.includes("api") || l.includes("security")) {
      return { agent: "technical", reason: "heuristic: technical" };
    }
    if (l.includes("start") || l.includes("onboard") || l.includes("next")) {
      return { agent: "onboarding", reason: "heuristic: onboarding" };
    }
    return { agent: "strategy", reason: "heuristic: default" };
  }
}

export async function POST(req: Request) {
  const body =
    (await req.json().catch(() => null)) as
      | { messages?: Msg[]; stream?: boolean }
      | null;
  const messages = (body?.messages ?? []).slice(-40);
  const wantsStream = Boolean(body?.stream);

  try {
    const route = await routeIntent(messages);

    const brevity = `
Hard style rules (do not mention these rules):
- Keep replies SHORT: max 6 lines.
- Ask at most ONE question per message.
- No long pitch paragraphs.
- Prefer: 1 sentence + up to 3 bullets.
`;

    const systems: Record<Route["agent"], string> = {
      sales:
        brevity +
        "You are Adam’s Assistant in SALES mode. Qualify quickly (scope, urgency) and suggest the next step: call/text Adam at (603) 748-4982.",
      strategy:
        brevity +
        "You are Adam’s Assistant in STRATEGY mode. Help the user describe their workflow, bottlenecks, and success metrics.",
      technical:
        brevity +
        "You are Adam’s Assistant in TECHNICAL mode. Discuss integrations, data, and security at a high level. Ask what systems/tools they use.",
      onboarding:
        brevity +
        "You are Adam’s Assistant in ONBOARDING mode. Outline discovery → roadmap → prototype → production/handoff. Ask one next-step question.",
    };

    if (wantsStream) {
      const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            sse(controller, "meta", { route, model: MODEL });
            await geminiStream(systems[route.agent], messages, (t) => {
              sse(controller, "delta", { text: t });
            });
            sse(controller, "done", {});
          } catch (e: any) {
            sse(controller, "error", { message: String(e?.message ?? e) });
          } finally {
            controller.close();
          }
        },
      });

      // Best-effort lead capture
      setTimeout(() => {
        void (async () => {
          try {
            const lastUser =
              messages.slice().reverse().find((m) => m.role === "user")
                ?.content ?? "";
            const contact = extractContact(lastUser);
            const looksLikeLead =
              /call|text|hire|work together|consult|project|quote|pricing|budget|timeline/i.test(
                lastUser
              );
            if (looksLikeLead) {
              const lead: Lead = {
                createdAt: new Date().toISOString(),
                source: "adam-landing",
                kind: "inbound",
                contact: {
                  name: contact.name,
                  company: contact.company,
                  email: contact.email,
                  phone: contact.phone,
                },
                qualifiers: { route: route.agent },
                lastUserMessage: lastUser,
                transcript: messages.map((m) => ({ role: m.role, content: m.content })),
              };
              await appendLead(lead);
            }
          } catch {
            // ignore
          }
        })();
      }, 0);

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    const message = await geminiText(systems[route.agent], messages);

    return NextResponse.json({ message, route, model: MODEL });
  } catch (e: any) {
    const msg = String(e?.message ?? e);
    const is429 = msg.includes("429") || msg.toLowerCase().includes("resource_exhausted") || msg.toLowerCase().includes("quota");
    return NextResponse.json(
      {
        message: is429
          ? "I’m temporarily rate-limited. If this is time-sensitive, call/text Adam at (603) 748-4982. Otherwise, try again in a minute — what’s the one-sentence summary of what you want to automate?"
          : "Something went wrong on my side. Please try again, or call/text Adam at (603) 748-4982.",
        error: is429 ? "rate_limited" : "chat_failed",
        model: MODEL,
      },
      { status: is429 ? 429 : 500 }
    );
  }
}
