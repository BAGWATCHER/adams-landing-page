"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export const DEMOS = [
  {
    id: null,
    label: "Adam's Assistant",
    emoji: "🤖",
    desc: "Ask about AI for your business",
  },
  {
    id: "slopesniper",
    label: "SlopeSniper",
    emoji: "📈",
    desc: "Solana trading AI",
  },
  {
    id: "contractor",
    label: "ContractorBot",
    emoji: "🏗️",
    desc: "Job & crew scheduling AI",
  },
  {
    id: "support",
    label: "SupportBot",
    emoji: "💬",
    desc: "Customer support AI",
  },
  {
    id: "intake",
    label: "IntakeBot",
    emoji: "📋",
    desc: "Lead qualification AI",
  },
] as const;

export type DemoId = (typeof DEMOS)[number]["id"];

export function DemoSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = (searchParams.get("demo") as DemoId) ?? null;
  const active = DEMOS.find((d) => d.id === current) ?? DEMOS[0];

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function select(id: DemoId) {
    setOpen(false);
    if (id === null) router.push("/chat");
    else router.push(`/chat?demo=${id}`);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white/[0.03] px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-white/[0.06] active:scale-95"
      >
        <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent-dim)]" />
        <span>{active.emoji} {active.label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl shadow-black/40">
          <div className="px-3 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
            Switch demo
          </div>
          {DEMOS.map((d) => (
            <button
              key={String(d.id)}
              onClick={() => select(d.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                d.id === current
                  ? "bg-[var(--accent)]/10 text-white"
                  : "text-zinc-300 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <span className="text-lg leading-none">{d.emoji}</span>
              <div className="min-w-0">
                <div className="text-[13px] font-medium leading-tight">{d.label}</div>
                <div className="text-[11px] text-zinc-500 truncate">{d.desc}</div>
              </div>
              {d.id === current && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-auto shrink-0">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
            </button>
          ))}
          <div className="border-t border-[var(--border)] px-3 py-2 text-[11px] text-zinc-600">
            Each demo is a real bot persona
          </div>
        </div>
      )}
    </div>
  );
}
