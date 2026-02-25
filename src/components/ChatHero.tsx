"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  {
    label: "Automate inbound lead intake",
    desc: "Website/phone/email/DMs → qualify, route, and follow up automatically",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    ),
  },
  {
    label: "Map AI opportunities in my workflow",
    desc: "Tell me your tools + bottlenecks → I’ll propose 3 high-ROI agent ideas",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    label: "Build internal agents for ops",
    desc: "Triage, follow-ups, reporting, handoffs — inside Slack/Telegram/Email",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    label: "Talk to Adam",
    desc: "If it’s a fit, I’ll tell you the best next step (call/text or quick scoping questions)",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
];

function AssistantMessage({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

export function ChatHero() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [hasStarted, setHasStarted] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Prevent the landing page from scrolling behind the chat UI on mobile.
    if (!hasStarted) return;
    const el = document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = "hidden";
    return () => {
      el.style.overflow = prev;
    };
  }, [hasStarted]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [msgs.length, loading]);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "auto";
    inputRef.current.style.height =
      Math.min(inputRef.current.scrollHeight, 160) + "px";
  }, [input]);

  useEffect(() => {
    // On mobile, auto-focusing re-opens the keyboard and feels janky.
    // Only auto-focus on desktop-ish pointers.
    if (!hasStarted) return;
    const isDesktop = typeof window !== "undefined" && window.matchMedia?.("(pointer:fine)")?.matches;
    if (isDesktop) setTimeout(() => inputRef.current?.focus(), 0);
  }, [hasStarted]);

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    if (!hasStarted) setHasStarted(true);
    setInput("");

    // Close the mobile keyboard after sending (ChatGPT-style)
    setTimeout(() => inputRef.current?.blur(), 0);

    const next: Msg[] = [...msgs, { role: "user", content: msg }];
    setMsgs(next);
    setLoading(true);

    try {
      // Optimistic assistant message (filled via streaming or JSON)
      const assistantIndex = next.length; // after user message
      setMsgs((m) => [...m, { role: "assistant", content: "" }]);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, stream: true }),
      });

      const ct = res.headers.get("content-type") || "";

      // Streaming (SSE)
      if (ct.includes("text/event-stream")) {
        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const dec = new TextDecoder();
        let buf = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });

          // parse SSE frames
          let idx;
          while ((idx = buf.indexOf("\n\n")) !== -1) {
            const frame = buf.slice(0, idx);
            buf = buf.slice(idx + 2);

            const lines = frame.split("\n");
            const ev = lines.find((l) => l.startsWith("event:"))?.slice(6).trim();
            const dataLine = lines.find((l) => l.startsWith("data:"))?.slice(5).trim();
            if (!dataLine) continue;

            let payload: any = null;
            try {
              payload = JSON.parse(dataLine);
            } catch {
              payload = null;
            }

            if (ev === "delta") {
              const t = String(payload?.text || "");
              if (!t) continue;
              setMsgs((m) => {
                const copy = [...m];
                const cur = copy[assistantIndex]?.content ?? "";
                copy[assistantIndex] = { role: "assistant", content: cur + t };
                return copy;
              });
              // Keep the newest text visible while streaming
              requestAnimationFrame(() => {
                scrollAreaRef.current?.scrollTo({
                  top: scrollAreaRef.current.scrollHeight,
                  behavior: "auto",
                });
              });
            }

            if (ev === "error") {
              const msg = String(payload?.message || "Agent error");
              setMsgs((m) => {
                const copy = [...m];
                copy[assistantIndex] = { role: "assistant", content: msg };
                return copy;
              });
            }
          }
        }

        return;
      }

      // Fallback JSON
      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        const err =
          (data && (data.message || data.error)) ||
          `Request failed (HTTP ${res.status}). Please try again.`;
        setMsgs((m) => {
          const copy = [...m];
          copy[assistantIndex] = { role: "assistant", content: err };
          return copy;
        });
        return;
      }

      setMsgs((m) => {
        const copy = [...m];
        copy[assistantIndex] = {
          role: "assistant",
          content: data?.message ?? "(No response)",
        };
        return copy;
      });
    } catch {
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Network error talking to the agent. Please try again (or refresh the page).",
        },
      ]);
    } finally {
      setLoading(false);
      // Do not auto-refocus; on mobile that re-opens the keyboard and breaks scrolling.
    }
  }

  // Dedicated chat overlay (ChatGPT-ish) once the user has started.
  if (hasStarted) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-1/2 top-[30%] h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.035]"
            style={{
              background:
                "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
              animation: "pulse-glow 6s ease-in-out infinite",
            }}
          />
          <div
            className="absolute left-1/2 top-[45%] h-[400px] w-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.02]"
            style={{
              background: "radial-gradient(ellipse, white 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 flex h-full w-full flex-col px-4 pt-3 sm:px-6">
          {/* Header */}
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setHasStarted(false)}
              className="shrink-0 rounded-full bg-white/[0.08] px-3 py-1.5 text-xs font-medium text-white hover:bg-white/[0.12]"
            >
              ← Back
            </button>

            <div className="min-w-0 flex-1 text-center text-sm font-semibold tracking-tight text-white">
              Adam’s Assistant
            </div>

            <button
              type="button"
              onClick={() => {
                setMsgs([]);
                setInput("");
                setLoading(false);
                setHasStarted(false);
              }}
              className="shrink-0 rounded-full bg-white/[0.08] px-3 py-1.5 text-xs font-medium text-white hover:bg-white/[0.12]"
            >
              New chat
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollAreaRef}
            className="mx-auto mt-3 min-h-0 w-full max-w-3xl flex-1 space-y-5 overflow-y-auto px-1 pb-40 pt-2 overscroll-contain"
          >
            {msgs.map((m, i) => (
              <div
                key={i}
                className="animate-slide-in-up"
                style={{ animationDelay: `${(i % 10) * 40}ms` }}
              >
                {m.role === "assistant" ? (
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-light)] text-[10px] font-bold text-white/70">
                      A
                    </div>
                    <div className="min-w-0 flex-1 text-[0.975rem] leading-relaxed text-zinc-200">
                      <AssistantMessage content={m.content} />
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div className="max-w-[92%] rounded-2xl bg-white/[0.08] px-4 py-2.5 text-[0.975rem] leading-relaxed text-white">
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-3 animate-fade-in">
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-light)] text-[10px] font-bold text-white/70">
                  A
                </div>
                <div className="rounded-2xl rounded-tl-md bg-[var(--surface)] px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    <span
                      className="h-[6px] w-[6px] rounded-full bg-zinc-400"
                      style={{ animation: "dot-bounce 1.4s ease-in-out infinite" }}
                    />
                    <span
                      className="h-[6px] w-[6px] rounded-full bg-zinc-400"
                      style={{
                        animation: "dot-bounce 1.4s ease-in-out 0.2s infinite",
                      }}
                    />
                    <span
                      className="h-[6px] w-[6px] rounded-full bg-zinc-400"
                      style={{
                        animation: "dot-bounce 1.4s ease-in-out 0.4s infinite",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 sm:px-6">
            <div className="mx-auto w-full max-w-3xl">
              <div className="input-glow relative rounded-[1.25rem] bg-[var(--surface)] shadow-xl shadow-black/30 ring-1 ring-white/[0.06] transition-shadow duration-300 focus-within:shadow-2xl focus-within:shadow-black/40 focus-within:ring-white/[0.1]">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Message Adam’s assistant…"
                  rows={1}
                  className="w-full resize-none bg-transparent px-5 pt-5 pb-14 text-[0.975rem] leading-relaxed text-white outline-none placeholder:text-zinc-400"
                />

                <div className="absolute bottom-3.5 left-5 right-5 flex items-center justify-end">
                  <button
                    onClick={() => send()}
                    disabled={!input.trim() || loading}
                    className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white text-black transition-all duration-200 hover:scale-105 hover:bg-zinc-100 disabled:opacity-20 disabled:hover:scale-100"
                    aria-label="Send message"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Landing hero mode (pre-chat)
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-5 sm:px-6">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-[30%] h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.035]"
          style={{
            background:
              "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            animation: "pulse-glow 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute left-1/2 top-[45%] h-[400px] w-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.02]"
          style={{
            background: "radial-gradient(ellipse, white 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[720px]">
        <h1 className="text-center text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.1] tracking-tight text-white">
          Chat with Adam’s assistant
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-[clamp(0.875rem,2vw,1.125rem)] leading-relaxed text-zinc-300">
          Custom AI bots + AI consulting — built around your docs, standards, and workflow.
          <span className="block mt-2 text-zinc-400">
            Typical: <span className="text-zinc-200">$375/hr</span> (scope-dependent) • setup often <span className="text-zinc-200">2–3 hrs</span> • delivery usually <span className="text-zinc-200">within 1–3 days</span>
          </span>
        </p>

        {/* Input */}
        <div className="mt-10 input-glow relative rounded-[1.25rem] bg-[var(--surface)] shadow-xl shadow-black/30 ring-1 ring-white/[0.06] transition-shadow duration-300 focus-within:shadow-2xl focus-within:shadow-black/40 focus-within:ring-white/[0.1]">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Try: “We need an AI agent to qualify inbound leads and follow up automatically. We use HubSpot + Slack.”"
            rows={1}
            className="w-full resize-none bg-transparent px-5 pt-5 pb-14 text-[0.9375rem] leading-relaxed text-white outline-none placeholder:text-zinc-400 sm:text-base"
          />
          <div className="absolute bottom-3.5 left-5 right-5 flex items-center justify-between">
            <span className="text-[11px] text-zinc-400 select-none">
              Press Enter to send
            </span>
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white text-black transition-all duration-200 hover:scale-105 hover:bg-zinc-100 disabled:opacity-20 disabled:hover:scale-100"
              aria-label="Send message"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <div className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => send(s.label)}
              className="group flex items-start gap-3 rounded-2xl border border-white/[0.04] bg-white/[0.02] px-4 py-3.5 text-left transition-all duration-300 hover:border-white/[0.08] hover:bg-white/[0.04]"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-zinc-400 transition-colors group-hover:text-white">
                {s.icon}
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-200 transition-colors group-hover:text-white">
                  {s.label}
                </div>
                <div className="mt-0.5 text-xs leading-relaxed text-zinc-400 transition-colors group-hover:text-zinc-300">
                  {s.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
