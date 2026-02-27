import Link from "next/link";

const DEMO_BOTS = [
  {
    id: "slopesniper",
    emoji: "📈",
    name: "SlopeSniper",
    desc: "Ask about token entries, check for rug pulls, or set a price alert — see how a trading AI handles real requests.",
    tag: "Solana trading",
  },
  {
    id: "contractor",
    emoji: "🏗️",
    name: "ContractorBot",
    desc: "Dispatch crews, track job status, handle intake and scheduling — the kind of AI that replaces three phone calls.",
    tag: "Telecom / trades",
  },
  {
    id: "support",
    emoji: "💬",
    name: "SupportBot",
    desc: "A customer support agent that answers FAQs, opens tickets, and escalates to humans at the right moment.",
    tag: "Customer support",
  },
  {
    id: "intake",
    emoji: "📋",
    name: "IntakeBot",
    desc: "Qualifies leads by asking smart questions — learns budget, timeline, and fit — then hands off a clean summary.",
    tag: "Lead intake",
  },
] as const;

export function LiveDemos() {
  return (
    <section className="border-t border-[var(--border)] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Try a live demo
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-zinc-400">
            Real bot personas — not descriptions. Click one and have an actual conversation to see what&apos;s possible.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DEMO_BOTS.map((bot) => (
            <Link
              key={bot.id}
              href={`/chat?demo=${bot.id}`}
              className="group flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 transition-all duration-200 hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5 active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{bot.emoji}</span>
                <span className="rounded-full border border-[var(--border)] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                  {bot.tag}
                </span>
              </div>

              <div className="mt-3 text-[15px] font-semibold text-white">
                {bot.name}
              </div>
              <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-zinc-400">
                {bot.desc}
              </p>

              <div className="mt-4 flex items-center gap-1 text-[13px] font-medium text-[var(--accent)] transition-all duration-200 group-hover:gap-2">
                Try it
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-5 text-[12px] text-zinc-600">
          These are demos — each persona shows what a real custom bot for that use case would feel like.
        </p>
      </div>
    </section>
  );
}
