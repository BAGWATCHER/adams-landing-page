"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const SUGGESTIONS = [
  { label: "I want my own AI assistant", desc: "Personal agent built around your workflow" },
  { label: "AI for my team", desc: "Give every employee their own agent" },
  { label: "Is my data safe?", desc: "ChatGPT vs a custom build" },
  { label: "What can AI actually do?", desc: "Real examples, not hype" },
];

export function LandingHero() {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "auto";
    inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 160) + "px";
  }, [input]);

  function navigate(text: string) {
    const q = text.trim();
    if (!q) return;
    router.push("/chat?q=" + encodeURIComponent(q));
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-5 sm:px-6">
      {/* Warm ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-[30%] h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.035]"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            animation: "pulse-glow 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute left-1/2 top-[45%] h-[400px] w-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.02]"
          style={{ background: "radial-gradient(ellipse, white 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[720px]">
        {/* Eyebrow */}
        <p className="text-center text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--accent)]">
          Adam Normandin &middot; Vector Data
        </p>

        {/* Headline */}
        <h1 className="mt-4 text-center font-[family-name:var(--font-display)] text-[clamp(3rem,8vw,5.5rem)] leading-[0.95] tracking-[0.04em] uppercase text-white">
          AI{" "}
          <span className="text-[var(--accent)]">built for you</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-center text-[clamp(0.9375rem,2vw,1.0625rem)] leading-relaxed text-zinc-400">
          Custom AI agents and bots that know your business, connect to your tools, and keep your data private.
          For you, your team, or your customers.
        </p>
        <p className="mx-auto mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[clamp(0.8125rem,1.8vw,0.875rem)] text-zinc-500">
          <span className="text-zinc-300 font-medium">Builds from $3K</span>
          <span className="text-zinc-600">&middot;</span>
          <span>$375/hr</span>
          <span className="text-zinc-600">&middot;</span>
          <span>Days, not months</span>
        </p>

        {/* Simplified composer — text only, navigates to /chat */}
        <div className="mt-10">
          <div className="rounded-2xl border-2 border-white/[0.06] bg-[var(--surface)] shadow-xl shadow-black/20 transition-all duration-300 focus-within:border-[var(--accent)]/40 focus-within:ring-1 focus-within:ring-[var(--accent)]/15 hover:border-white/[0.1]">
            <div className="px-4 py-3 md:px-5 md:py-3.5">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    navigate(input);
                  }
                }}
                placeholder="Tell me what you need help with..."
                rows={1}
                className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-white outline-none placeholder:text-zinc-500"
              />
            </div>
            <div className="flex items-center justify-between px-3 pb-2.5 md:px-4">
              <span className="text-[11px] text-zinc-600 select-none hidden sm:block ml-1">
                press &crarr; to send
              </span>
              <button
                onClick={() => navigate(input)}
                disabled={!input.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-black transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-20 shrink-0 ml-auto"
                aria-label="Send message"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Suggestion chips */}
        <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => navigate(s.label)}
              className="group rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-left transition-all duration-200 hover:border-[var(--accent)]/30 hover:bg-white/[0.04] active:scale-[0.98] sm:text-center"
            >
              <div className="text-[14px] font-medium text-zinc-300 group-hover:text-white transition-colors">
                {s.label}
              </div>
              <div className="mt-0.5 text-[12px] leading-snug text-zinc-500 group-hover:text-zinc-400 transition-colors sm:hidden">
                {s.desc}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
