import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { appendLead, type Lead } from "./leadStore";

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const google = createGoogleGenerativeAI({ apiKey: mustEnv("GEMINI_API_KEY") });
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "audio/webm",
  "audio/mp4",
  "audio/ogg",
  "audio/mpeg",
  "audio/wav",
]);

const MAX_ATTACHMENTS = 4;
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024; // 10 MB

const ADAM_KB = `
You are Adam's Assistant — a personal AI agent for Adam Normandin and Vector Data.

PRIMARY GOAL:
- Help people understand what a personal AI can do for them — for their own workflow, their team, or their business.
- Be genuinely helpful. Even if they never hire us, they should leave smarter about what's possible with AI.
- When they're ready, qualify the lead and connect them with Adam.

POSITIONING:
- Adam builds personal AI assistants and custom agents — for individuals, teams, and businesses.
- We build personal AI that actually knows your business, connects to your tools, and stays private.
- A personal AI knows your business, connects to your tools, remembers your context, and stays private.
- Flexible engagement: we can build one focused bot or a broader multi-agent system depending on what you need.
- US-based, real identity, real accountability. Not an anonymous agency or offshore shop.

WHAT WE BUILD:
- Personal AI assistants: knows your workflow, your preferences, your tools — not a blank slate every conversation
- Team agents: every employee gets their own AI scoped to their role, connected to the tools they use
- Business agents: customer-facing agents for intake, qualification, support — running 24/7 in Slack, Telegram, SMS, email, or embedded on a site
- Under the hood: sub-agents handle routing, research, drafting, validation — you just talk to one assistant

TECHNICAL DEPTH (use naturally when relevant — show you understand architecture, not just prompts):
- Persistent memory: your AI remembers you across conversations — context, preferences, history — scoped per user
- Multi-agent orchestration: your personal assistant has specialized sub-agents underneath for different tasks
- Tool integration: connects to your calendar, CRM, email, Slack, databases — whatever you actually use
- Model routing: fast models for quick tasks, powerful models for complex reasoning — optimized cost
- Secure by default: API-based model access, privacy-conscious handling, and role-based access control
- Production infrastructure: monitoring, logging, failover — your AI doesn't go down

WHEN SOMEONE DESCRIBES THEIR WORKFLOW:
- Walk them through how a personal AI would handle it step by step.
- Be specific: what it would ask, what it would remember, what tools it would connect to, what it would output.
- Show them how it starts simple (just for them) and can grow (team agents, deeper integrations) over time.
- Show them possibilities they haven't thought of yet.

DATA PRIVACY & TRUST:
- Your data is used to produce outputs for you, with privacy-conscious handling.
- We build with API-based model access and avoid sending your business context through consumer chat apps.
- We can add logging/auditability where it matters (and keep sensitive data minimized).
- Adam is a real person with a public reputation. Not a faceless agency.

PRICING:
- Builds start at $3,000. Final price depends on scope, integrations, and complexity — everything is custom.
- $375/hr is the consulting rate, not a simple per-hour build rate. Do NOT say the build is "billed at $375/hr."
- Do NOT quote an average price or imply a fixed hourly billing model for builds.
- Flexible scope: we can keep it focused or go broad across teams/channels — depends on your workflow and goals.

HARD RULES:
- Don't claim Adam is currently in the chat.
- Don't promise fixed pricing/timelines/deliverables.
- Don't request secrets (passwords, API keys, private keys, PHI).
- Prefer 1 question at a time.
- Be genuinely helpful — not pushy or salesy.
- Sound like a knowledgeable friend, not a salesperson or a corporate pitch deck. Warm but technically credible.

SOFT CAPTURE:
- Don't require email. If needed, ask for a phone number for follow-up.

CONTACT CTA:
- If they're serious or time-sensitive: "Call/text Adam at (603) 748-4982."
`;

type Route = {
  agent: "sales" | "strategy" | "technical" | "onboarding" | "educator";
  reason: string;
};

/** Extract text content from UIMessage parts */
function textFromParts(msg: UIMessage): string {
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("\n");
}

/** Validate file parts on user messages */
function validateFileParts(msg: UIMessage): string | null {
  const fileParts = msg.parts.filter((p) => p.type === "file");
  if (fileParts.length === 0) return null;
  if (fileParts.length > MAX_ATTACHMENTS)
    return `Too many attachments (max ${MAX_ATTACHMENTS})`;
  for (const f of fileParts) {
    if (f.type !== "file") continue;
    const mime = f.mediaType;
    if (mime && !ALLOWED_MIMES.has(mime))
      return `Unsupported file type: ${mime}`;
    // Estimate base64 size from data URL
    const commaIdx = f.url.indexOf(",");
    if (commaIdx !== -1) {
      const b64 = f.url.slice(commaIdx + 1);
      const bytes = Math.ceil((b64.length * 3) / 4);
      if (bytes > MAX_ATTACHMENT_BYTES)
        return `Attachment too large (max 10 MB)`;
    }
  }
  return null;
}

function extractContact(text: string): {
  phone?: string;
  email?: string;
  company?: string;
  name?: string;
} {
  const out: Record<string, string> = {};
  const phone = text.match(
    /(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/
  )?.[0];
  if (phone) out.phone = phone;
  const email = text.match(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
  )?.[0];
  if (email) out.email = email;

  for (const key of ["name", "company"]) {
    const re = new RegExp(`(?:^|\n)\\s*${key}\\s*[:=-]\\s*(.+)`, "i");
    const m = text.match(re);
    if (m?.[1]) out[key] = m[1].trim();
  }

  return out;
}

async function routeIntent(messages: UIMessage[]): Promise<Route> {
  const lastUserMsg = messages.slice().reverse().find((m) => m.role === "user");
  const last = lastUserMsg ? textFromParts(lastUserMsg) : "";

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

  // Fast heuristics first (avoid router model calls when obvious)
  const l = last.toLowerCase();
  if (l.includes("price") || l.includes("cost") || l.includes("budget")) {
    return { agent: "sales", reason: "heuristic: pricing/budget" };
  }
  if (l.includes("integr") || l.includes("api") || l.includes("security") || l.includes("privacy") || l.includes("data safe")) {
    return { agent: "technical", reason: "heuristic: technical" };
  }
  if (l.includes("start") || l.includes("onboard") || l.includes("next")) {
    return { agent: "onboarding", reason: "heuristic: onboarding" };
  }
  if (
    l.includes("what can ai") || l.includes("what can a bot") || l.includes("what is ai") ||
    l.includes("how does ai") || l.includes("how do bots") || l.includes("what's possible") ||
    l.includes("automate") || l.includes("chatgpt") || l.includes("learn") ||
    l.includes("educate") || l.includes("example") || l.includes("use case") ||
    l.includes("capabilities") || l.includes("what could")
  ) {
    return { agent: "educator", reason: "heuristic: education/exploration" };
  }

  // Default to strategy for general workflow discussions
  return { agent: "strategy", reason: "heuristic: default" };
}

type LegacyMsg = { role: "user" | "assistant"; content: string };

type IncomingBody = {
  // Newer shape (ai-sdk UIMessage)
  messages?: UIMessage[];
  // Legacy shape (ChatHero originally sent this)
  legacyMessages?: LegacyMsg[];
};

function toUIMessage(m: LegacyMsg): UIMessage {
  return {
    id: `legacy-${Math.random().toString(16).slice(2)}`,
    role: m.role,
    parts: [{ type: "text", text: m.content }],
  } as UIMessage;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as IncomingBody | null;

  // Accept both {messages:[UIMessage]} and {messages:[{role,content}]} for backward compatibility.
  const raw = (body as any)?.messages;
  const messages: UIMessage[] = Array.isArray(raw)
    ? (raw.length > 0 && (raw[0] as any)?.parts ? (raw as UIMessage[]) : (raw as LegacyMsg[]).map(toUIMessage))
    : Array.isArray(body?.legacyMessages)
      ? body!.legacyMessages!.map(toUIMessage)
      : [];

  const messagesLimited = messages.slice(-40);

  // Validate file parts on user messages
  for (const m of messagesLimited) {
    if (m.role === "user") {
      const err = validateFileParts(m);
      if (err) {
        return new Response(JSON.stringify({ message: err, error: "validation" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
  }

  try {
    const route = await routeIntent(messagesLimited);

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
        "You are Adam's Assistant in SALES mode. Be warm and direct, not corporate. If asked about pricing: builds start at $3,000; final price depends on scope, integrations, and complexity — everything is custom; do not say it is billed hourly and do not quote an average. Emphasize: start with a personal AI, add team agents and deeper integrations over time — you don't have to buy everything at once. Qualify quickly (what they need, who it's for, urgency) and suggest: call/text Adam at (603) 748-4982.",
      strategy:
        brevity +
        "You are Adam's Assistant in STRATEGY mode. When they describe their workflow, walk them through how a personal AI would handle it — what it would remember, what tools it would connect to, what it would do automatically. Show how it starts simple (just for them) and can grow (team agents, deeper integrations). Be specific and practical.",
      technical:
        brevity +
        "You are Adam's Assistant in TECHNICAL mode. Discuss how personal AI actually works under the hood: persistent memory, sub-agents for different tasks, tool integrations via API, model routing, and pragmatic data privacy. Contrast with consumer chat apps (blank slate every chat, copy/paste workflows). Ask what tools they use day-to-day.",
      onboarding:
        brevity +
        "You are Adam's Assistant in ONBOARDING mode. Outline how it works: discovery call → build your personal AI → add integrations → expand to team. Emphasize you can start small with just one person and grow from there. Ask one next-step question.",
      educator:
        brevity +
        "You are Adam's Assistant in EDUCATOR mode. Help people understand what a personal AI can actually do for them — not just answer questions, but remember their context, connect to their tools, handle tasks, and get better over time. Walk through specific examples from their work. Explain the difference between ChatGPT (blank slate, no integrations, trains on your data) and a custom personal AI (remembers you, connects to your stack, private). Be a knowledgeable friend, not a salesperson. If they want to go deeper, suggest they call/text Adam.",
    };

    // Best-effort lead capture (fire-and-forget)
    setTimeout(() => {
      void (async () => {
        try {
          const lastUserMsg = messagesLimited
            .slice()
            .reverse()
            .find((m) => m.role === "user");
          const lastUser = lastUserMsg ? textFromParts(lastUserMsg) : "";
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
              transcript: messagesLimited.map((m) => ({
                role: m.role,
                content: textFromParts(m),
              })),
            };
            await appendLead(lead);
          }
        } catch {
          // ignore
        }
      })();
    }, 0);

    const modelMessages = await convertToModelMessages(messagesLimited);

    const abort = new AbortController();
    const timeoutMs = 30000;

    const uiStream = createUIMessageStream({
      execute: async ({ writer }) => {
        const timeout = setTimeout(() => abort.abort(), timeoutMs);

        try {
          writer.write({ type: "start", messageMetadata: { route, model: MODEL } });
          writer.write({ type: "start-step" });
          writer.write({ type: "text-start", id: "0" });

          const stream = streamText({
            model: google(MODEL),
            system: `${systems[route.agent]}\n\n${ADAM_KB}`,
            messages: modelMessages,
            abortSignal: abort.signal,
          });

          // Stream word-by-word for smooth typing effect.
          // Gemini often returns large chunks, so we split them into words
          // and flush each one with a small delay.
          for await (const chunk of stream.textStream) {
            if (!chunk) continue;
            const words = chunk.split(/(?<=\s)/); // split keeping whitespace attached
            for (const word of words) {
              writer.write({ type: "text-delta", id: "0", delta: word });
              await new Promise((r) => setTimeout(r, 20));
            }
          }

          writer.write({ type: "text-end", id: "0" });
          writer.write({ type: "finish-step" });
          writer.write({ type: "finish", finishReason: "stop", messageMetadata: { route, model: MODEL } });
        } catch (err: any) {
          const msg = String(err?.message ?? err);
          const isTimeout = msg.toLowerCase().includes("timeout");
          const isAbort =
            isTimeout ||
            msg.toLowerCase().includes("aborted") ||
            msg.toLowerCase().includes("abort");

          writer.write({
            type: "error",
            errorText: isAbort
              ? "Agent timed out. Please try again, or call/text Adam at (603) 748-4982."
              : "Agent error. Please try again, or call/text Adam at (603) 748-4982.",
          });

          writer.write({ type: "text-end", id: "0" });
          writer.write({ type: "finish-step" });
          writer.write({ type: "finish", finishReason: "error", messageMetadata: { route, model: MODEL } });
        } finally {
          clearTimeout(timeout);
        }
      },
    });

    return createUIMessageStreamResponse({ stream: uiStream });
  } catch (e: unknown) {
    console.error("/api/chat error", e);
    const msg = String(e instanceof Error ? e.message : e);
    const is429 =
      msg.includes("429") ||
      msg.toLowerCase().includes("resource_exhausted") ||
      msg.toLowerCase().includes("quota");
    return new Response(
      JSON.stringify({
        message: is429
          ? "I'm temporarily rate-limited. If this is time-sensitive, call/text Adam at (603) 748-4982. Otherwise, try again in a minute — what's the one-sentence summary of what you want to automate?"
          : "Something went wrong on my side. Please try again, or call/text Adam at (603) 748-4982.",
        error: is429 ? "rate_limited" : "chat_failed",
        model: MODEL,
      }),
      {
        status: is429 ? 429 : 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
