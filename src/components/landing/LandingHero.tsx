"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SUGGESTIONS = [
  { label: "I want my own AI assistant" },
  { label: "AI for my team" },
  { label: "Is my data safe?" },
  { label: "What can AI do for you?" },
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
      {/* Logo — top left */}
      <div className="absolute top-4 left-5 sm:left-6 z-10">
        <Image src="/logo.png" alt="Logo" width={40} height={40} priority />
      </div>

      <div className="relative z-10 w-full max-w-[720px]">
        {/* Headline */}
        <h1 className="text-center text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-tight tracking-tight text-white">
          What can AI do for{" "}
          <span className="text-[var(--accent)]">you</span>?
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-center text-[clamp(0.9375rem,2vw,1.0625rem)] leading-relaxed text-zinc-400">
          Custom AI agents and bots that know your business, connect to your tools, and keep your data private.
          For you, your team, or your customers.
          If you have an idea, we&apos;ll tell you what&apos;s possible (and what to build first).
        </p>

        {/* Composer */}
        <div className="mt-10">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl shadow-black/20 transition-all duration-300 focus-within:border-[var(--accent)]/40 focus-within:ring-1 focus-within:ring-[var(--accent)]/15 hover:border-white/[0.12]">
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
                placeholder="Ask anything..."
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

        {/* Suggestion chips — pill-shaped */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => navigate(s.label)}
              className="rounded-full border border-[var(--border)] bg-white/[0.02] px-4 py-2 text-[14px] font-medium text-zinc-400 transition-all duration-200 hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/10 hover:text-white active:scale-[0.97]"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
