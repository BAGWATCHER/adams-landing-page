type Build = {
  name: string;
  tagline: string;
  bullets: string[];
  badge: string;
};

const BUILDS: Build[] = [
  {
    name: "Parts & Service Bot",
    tagline: "Diagnostic → parts workflow automation (example build)",
    badge: "Parts + Ops",
    bullets: [
      "Turns symptoms/scans into parts lists + fitment questions",
      "Reduces wrong-part returns with strict checklisting",
      "Drafts BOM/order plans for review + approval",
    ],
  },
  {
    name: "Telecom Construction AI",
    tagline: "Scope-controlled execution engine (example build)",
    badge: "Telecom",
    bullets: [
      "Authority-first scope extraction (no guessing)",
      "Procurement-ready BOMs + labor/equipment plans",
      "RFIs + mismatch/gap reports with cost/schedule language",
    ],
  },
  {
    name: "Engineering Agents",
    tagline: "Internal agents that live in your tools (example build)",
    badge: "Engineering",
    bullets: [
      "Slack/Telegram/email-native agents (no new dashboard)",
      "Integrations, guardrails, and handoff-ready specs",
      "Built to be operated by teams, not babysat",
    ],
  },
];

export function ExampleBuilds() {
  return (
    <section className="border-t border-white/[0.06] py-14">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
            Example builds
          </p>
          <h2 className="mt-3 text-lg font-semibold text-white">
            Custom per customer — these are reference builds.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
            Every bot is tailored to your docs, standards, and workflow. The goal is
            fast delivery without cutting corners on scope control.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {BUILDS.map((b) => (
          <div
            key={b.name}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-white">{b.name}</div>
              <div className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-zinc-300">
                {b.badge}
              </div>
            </div>

            <div className="mt-2 text-xs leading-relaxed text-zinc-400">
              {b.tagline}
            </div>

            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              {b.bullets.map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] opacity-80" />
                  <span className="leading-relaxed">{x}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5">
        <div className="text-sm font-semibold text-white">Next step</div>
        <p className="mt-2 text-sm text-zinc-400">
          Share your workflow + docs/standards. We’ll scope the bot, confirm fit,
          and give you the best next step.
        </p>
        <a
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black"
          href="tel:+16037484982"
        >
          Call/text Adam: (603) 748-4982
        </a>
      </div>
      </div>
    </section>
  );
}
