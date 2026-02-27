type Build = {
  name: string;
  tagline: string;
  bullets: string[];
};

const BUILDS: Build[] = [
  {
    name: "For You",
    tagline: "A personal AI that actually knows your business",
    bullets: [
      "Knows your workflow, your preferences, your tools — not a blank slate every conversation",
      "Handles the stuff you keep doing manually: research, drafting, scheduling, follow-ups",
      "Privacy-conscious by default — built with API-based model access and careful data handling",
    ],
  },
  {
    name: "For Your Team",
    tagline: "Every employee gets their own agent",
    bullets: [
      "Each person gets an AI scoped to their role, connected to the tools they actually use",
      "Deploy to the right people and channels — scoped permissions, clear handoffs, and fast iteration",
      "Persistent memory across sessions — it remembers context, learns preferences, gets better",
    ],
  },
  {
    name: "For Your Business",
    tagline: "Agents that run 24/7 in the channels your customers use",
    bullets: [
      "Customer-facing agents for intake, qualification, support — Slack, Telegram, SMS, web, email",
      "Internal workflow agents that replace the copy-paste between your tools",
      "Sub-agents handle routing, validation, and structured output",
    ],
  },
];

type Tier = {
  name: string;
  who: string;
  includes: string[];
  timeline: string;
};

const TIERS: Tier[] = [
  {
    name: "Personal AI",
    who: "Solo operators, founders, consultants",
    includes: [
      "One focused workflow (inbox triage, research, drafting, scheduling)",
      "Connects to 1–2 tools you already use",
      "Persistent memory — knows your context, your tone, your preferences",
      "Web chat or Slack deployment",
    ],
    timeline: "Working v1 in days",
  },
  {
    name: "Team System",
    who: "Small teams who want AI across roles",
    includes: [
      "Scoped agents per role — sales, ops, support, admin",
      "Shared knowledge base across the team",
      "3–5 tool integrations (CRM, calendar, email, Slack, databases)",
      "Multi-channel deployment with scoped access controls",
    ],
    timeline: "Full system in 2–4 weeks",
  },
  {
    name: "Business Deployment",
    who: "Customer-facing operations at scale",
    includes: [
      "Customer-facing agents running 24/7 in your existing channels",
      "Full integration stack: CRM, inbox, calendar, databases, internal APIs",
      "Multi-agent orchestration with routing, validation, and escalation",
      "Monitoring, logging, failover, and ongoing support",
    ],
    timeline: "Phased rollout, first agent live in week 1",
  },
];

export function ExampleBuilds() {
  return (
    <section className="border-t border-[var(--border)] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">

        {/* Section header */}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            What we build
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-zinc-400">
            Custom AI bots built around your real workflow.
            Internal ops, customer support, lead intake, quoting, follow-ups — whatever actually moves the needle.
          </p>
        </div>

        {/* 3-card grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {BUILDS.map((b) => (
            <div
              key={b.name}
              className="rounded-lg bg-[var(--surface)] p-6"
            >
              <h3 className="text-base font-semibold text-white">{b.name}</h3>
              <div className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">
                {b.tagline}
              </div>
              <ul className="mt-5 space-y-2.5 text-[15px] text-zinc-300">
                {b.bullets.map((x) => (
                  <li key={x} className="flex gap-2.5">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] opacity-80" />
                    <span className="leading-relaxed">{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Service tiers */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Engagement tiers
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-zinc-400">
            Start with one focused bot. Grow into a full system. Every tier ships a working v1 fast — then we iterate based on real usage.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {TIERS.map((t, i) => (
              <div
                key={t.name}
                className={`rounded-lg p-6 ${
                  i === 1
                    ? "border border-[var(--accent)]/20 bg-[var(--accent)]/5"
                    : "bg-[var(--surface)]"
                }`}
              >
                {i === 1 && (
                  <div className="mb-3 inline-flex rounded bg-[var(--accent)]/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
                    Most common
                  </div>
                )}
                <div className="text-base font-semibold text-white">{t.name}</div>
                <div className="mt-1 text-[12px] text-zinc-500">{t.who}</div>

                <ul className="mt-5 space-y-2.5">
                  {t.includes.map((x) => (
                    <li key={x} className="flex gap-2.5 text-[14px] text-zinc-300">
                      <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] opacity-80" />
                      <span className="leading-relaxed">{x}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 text-[12px] font-medium text-[var(--accent)]">
                  {t.timeline}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-16 rounded-lg bg-[var(--surface)] p-6 sm:p-8">
          <h3 className="text-xl font-semibold text-white">
            Frequently asked questions
          </h3>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <div className="text-[14px] font-semibold text-white">What does &ldquo;builds from $3K&rdquo; mean?</div>
              <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">
                A focused first bot with one workflow and lightweight integrations. Larger builds scale with scope, data, and channels.
              </p>
            </div>
            <div>
              <div className="text-[14px] font-semibold text-white">Can it connect to my tools?</div>
              <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">
                Yes — CRMs, inboxes, calendars, databases, spreadsheets, internal APIs, and more.
              </p>
            </div>
            <div>
              <div className="text-[14px] font-semibold text-white">Do you train on my data?</div>
              <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">
                We build with API-based model access and privacy-conscious handling. Your business context is used to generate outputs for you.
              </p>
            </div>
            <div>
              <div className="text-[14px] font-semibold text-white">Where can the bot run?</div>
              <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">
                Web chat, SMS, Telegram, Slack, email — we deploy it where your customers and team already are.
              </p>
            </div>
            <div>
              <div className="text-[14px] font-semibold text-white">How long does it take?</div>
              <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">
                Depends on scope, but we aim for a working v1 fast — then iterate based on real usage.
              </p>
            </div>
            <div>
              <div className="text-[14px] font-semibold text-white">Can we start small?</div>
              <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">
                Yes. We can start focused if you want, or build a broader system across teams and channels — it depends on what you need.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              className="inline-flex items-center justify-center rounded-md bg-[var(--accent)] px-5 py-2.5 text-[15px] font-semibold text-black transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
              href="tel:+16037484982"
            >
              Call/text Adam: (603) 748-4982
            </a>
            <span className="text-[14px] text-zinc-500 sm:ml-2">
              Builds start at <span className="text-zinc-300 font-medium">$3,000</span> &middot; <span className="text-zinc-300 font-medium">$375/hr</span>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
