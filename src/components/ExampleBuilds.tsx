type Build = {
  name: string;
  tagline: string;
  bullets: string[];
  badge: string;
};

const BUILDS: Build[] = [
  {
    name: "For You",
    tagline: "A personal AI that actually knows your business",
    badge: "Personal",
    bullets: [
      "Knows your workflow, your preferences, your tools — not a blank slate every conversation",
      "Handles the stuff you keep doing manually: research, drafting, scheduling, follow-ups",
      "Privacy-conscious by default — built with API-based model access and careful data handling",
    ],
  },
  {
    name: "For Your Team",
    tagline: "Every employee gets their own agent",
    badge: "Team",
    bullets: [
      "Each person gets an AI scoped to their role, connected to the tools they actually use",
      "Deploy to the right people and channels — scoped permissions, clear handoffs, and fast iteration",
      "Persistent memory across sessions — it remembers context, learns preferences, gets better",
    ],
  },
  {
    name: "For Your Business",
    tagline: "Agents that run 24/7 in the channels your customers use",
    badge: "Business",
    bullets: [
      "Customer-facing agents for intake, qualification, support — Slack, Telegram, SMS, web, email",
      "Internal workflow agents that replace the copy-paste between your tools",
      "Sub-agents under the hood handle routing, validation, and structured output",
    ],
  },
];

export function ExampleBuilds() {
  return (
    <section className="border-t border-white/[0.06] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            How it works
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl tracking-[0.03em] uppercase text-white sm:text-3xl">
            What we build
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-zinc-400">
            Custom AI bots built around your real workflow.
            Internal ops, customer support, lead intake, quoting, follow-ups — whatever actually moves the needle.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {BUILDS.map((b) => (
          <div
            key={b.name}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-colors duration-200 hover:border-white/[0.1] hover:bg-white/[0.03]"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-white">{b.name}</h3>
              <div className="shrink-0 rounded-full bg-white/[0.06] px-2.5 py-1 text-[12px] font-medium text-zinc-300">
                {b.badge}
              </div>
            </div>

            <div className="mt-2 text-[13px] leading-relaxed text-zinc-500">
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

      {/* Core capabilities */}
      <div className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 sm:p-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          How we help
        </p>
        <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl tracking-[0.03em] uppercase text-white sm:text-2xl">
          Our core capabilities
        </h3>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-zinc-400">
          We build practical AI bots that do real work: they connect to your tools, run multi-step workflows, and operate in the channels your customers and team already use.
        </p>

        <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="text-[14px] font-semibold text-white">Bots for specific jobs</div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">
              Intake, qualification, support triage, follow-ups, internal ops — scoped to your workflow.
            </p>
          </div>
          <div>
            <div className="text-[14px] font-semibold text-white">Connects to your tools</div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">
              Email, calendar, CRM, databases, and internal systems — no copy/paste.
            </p>
          </div>
          <div>
            <div className="text-[14px] font-semibold text-white">Multi-step workflows</div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">
              Not just chat. The bot can run a process end-to-end with validation and checks.
            </p>
          </div>
          <div>
            <div className="text-[14px] font-semibold text-white">Knowledge bots (RAG)</div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">
              Use your docs and data when accuracy matters, and ask smart questions when context is missing.
            </p>
          </div>
          <div>
            <div className="text-[14px] font-semibold text-white">Guardrails + approvals</div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">
              Safe execution for real businesses: scoped access, input validation, approvals for sensitive actions.
            </p>
          </div>
          <div>
            <div className="text-[14px] font-semibold text-white">Multi-channel deployment</div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">
              Web chat, SMS, Telegram, Slack — the same bot logic where people already talk.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="text-[14px] font-semibold text-white">The new advantage</div>
          <p className="mt-2 text-[14px] leading-relaxed text-zinc-400">
            Models are improving every month. That means workflows that were impossible recently are suddenly automatable.
            If you have a niche process, you may be able to build an AI system your competitors can&apos;t buy — because nobody sells it yet.
          </p>
        </div>
      </div>

      {/* Avoid the PoC rabbit hole */}
      <div className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 sm:p-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Why it works
        </p>
        <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl tracking-[0.03em] uppercase text-white sm:text-2xl">
          No PoCs. We ship bots that run in your real workflow.
        </h3>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-zinc-400">
          If it can&apos;t run inside your day-to-day tools and channels, it&apos;s not an AI system — it&apos;s a demo.
        </p>
        <ul className="mt-6 space-y-2.5 text-[15px] text-zinc-300">
          <li className="flex gap-2.5"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] opacity-80" /><span className="leading-relaxed">Integrations first (email/CRM/calendar/DBs), not copy-paste.</span></li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] opacity-80" /><span className="leading-relaxed">Guardrails + approvals where it matters.</span></li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] opacity-80" /><span className="leading-relaxed">Monitoring/logging so it stays reliable.</span></li>
        </ul>
      </div>

      {/* FAQs */}
      <div className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 sm:p-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          FAQs
        </p>
        <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl tracking-[0.03em] uppercase text-white sm:text-2xl">
          Quick answers
        </h3>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <div className="text-[14px] font-semibold text-white">What does “builds from $3K” mean?</div>
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
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-[15px] font-semibold text-black transition-all duration-200 hover:scale-[1.02] hover:bg-zinc-100"
            href="tel:+16037484982"
          >
            Call/text Adam: (603) 748-4982
          </a>
          <span className="text-[14px] text-zinc-500 sm:ml-2">
            Builds start at <span className="text-zinc-300 font-medium">$3,000</span> &middot; Billed at <span className="text-zinc-300 font-medium">$375/hr</span>
          </span>
        </div>
      </div>

      {/* Why it's different from ChatGPT */}
      <div className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 sm:p-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Under the hood
        </p>
        <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl tracking-[0.03em] uppercase text-white sm:text-2xl">
          Why this isn&apos;t just ChatGPT with a system prompt.
        </h3>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-zinc-400">
          Your personal AI has real infrastructure behind it. Here&apos;s what makes it actually useful instead of a novelty.
        </p>

        <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="text-[14px] font-semibold text-white">It remembers you</div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">
              Persistent memory across conversations. Your preferences, your context, your history — stored securely and scoped to you. Not a blank slate every time.
            </p>
          </div>
          <div>
            <div className="text-[14px] font-semibold text-white">Your data stays yours</div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">
              We build with API-based model access and privacy-conscious data handling. Your business data is used to generate outputs for you — not to train a public consumer chatbot.
            </p>
          </div>
          <div>
            <div className="text-[14px] font-semibold text-white">It connects to your tools</div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">
              Plugs into your calendar, CRM, email, Slack, databases — whatever you actually use. Not a separate app you have to copy-paste into.
            </p>
          </div>
          <div>
            <div className="text-[14px] font-semibold text-white">Sub-agents handle the details</div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">
              You talk to one assistant. Behind the scenes, specialized agents handle routing, research, drafting, validation — each scoped to its job.
            </p>
          </div>
          <div>
            <div className="text-[14px] font-semibold text-white">Right model for every task</div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">
              Fast models for quick tasks, powerful models for complex reasoning. You get the best output without overpaying on every message.
            </p>
          </div>
          <div>
            <div className="text-[14px] font-semibold text-white">Always on, always reliable</div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">
              Production hosting with monitoring and logging. Your AI doesn&apos;t go down because a free tier ran out.
            </p>
          </div>
        </div>
      </div>

      {/* Cost comparison — what the market looks like */}
      <div className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6">
        <div className="text-base font-semibold text-white">Your alternatives</div>
        <div className="mt-2 text-[14px] leading-relaxed text-zinc-500">
          Most people start with a chatbot. The gap is turning it into a real system: integrations, guardrails, and reliability.
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-[14px] text-left">
            <thead>
              <tr className="border-b border-white/[0.06] text-zinc-500">
                <th className="pb-3 pr-4 font-medium"></th>
                <th className="pb-3 px-4 font-medium">ChatGPT / Gemini</th>
                <th className="pb-3 px-4 font-medium">Build it yourself</th>
                <th className="pb-3 px-4 font-medium">Hire an agency</th>
                <th className="pb-3 pl-4 font-medium text-[var(--accent)]">Us</th>
              </tr>
            </thead>
            <tbody className="text-zinc-400">
              <tr className="border-b border-white/[0.04]">
                <td className="py-3 pr-4 text-zinc-500 font-medium">Typical cost</td>
                <td className="py-3 px-4">$20/mo + your time</td>
                <td className="py-3 px-4">Your time + maintenance</td>
                <td className="py-3 px-4">$25K–$150K</td>
                <td className="py-3 pl-4 text-white font-medium">From $3K</td>
              </tr>
              <tr className="border-b border-white/[0.04]">
                <td className="py-3 pr-4 text-zinc-500 font-medium">What you get</td>
                <td className="py-3 px-4">Great answers</td>
                <td className="py-3 px-4">A custom system (eventually)</td>
                <td className="py-3 px-4">A custom system</td>
                <td className="py-3 pl-4 text-white font-medium">A custom bot that ships fast</td>
              </tr>
              <tr className="border-b border-white/[0.04]">
                <td className="py-3 pr-4 text-zinc-500 font-medium">Integrations</td>
                <td className="py-3 px-4">Manual / copy-paste</td>
                <td className="py-3 px-4">If you build them</td>
                <td className="py-3 px-4">Usually</td>
                <td className="py-3 pl-4 text-white font-medium">Yes</td>
              </tr>
              <tr className="border-b border-white/[0.04]">
                <td className="py-3 pr-4 text-zinc-500 font-medium">Guardrails</td>
                <td className="py-3 px-4">Limited</td>
                <td className="py-3 px-4">If you implement them</td>
                <td className="py-3 px-4">Varies</td>
                <td className="py-3 pl-4 text-white font-medium">Built-in</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-zinc-500 font-medium">Speed to v1</td>
                <td className="py-3 px-4">Instant</td>
                <td className="py-3 px-4">Weeks/months</td>
                <td className="py-3 px-4">Weeks/months</td>
                <td className="py-3 pl-4 text-white font-medium">Fast</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Why us */}
      <div className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 sm:p-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Why us
        </p>
        <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl tracking-[0.03em] uppercase text-white sm:text-2xl">
          The AI you actually want to use every day.
        </h3>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-zinc-400">
          AI is moving fast. We stay on top of it so you don&apos;t have to —
          and we turn it into something that actually works for your day-to-day.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <div className="text-[14px] font-semibold text-white">We stay on the frontier</div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">
              New models, new capabilities, new possibilities — we&apos;re tracking all of it. Your AI gets better as the technology gets better, without you having to keep up.
            </p>
          </div>
          <div>
            <div className="text-[14px] font-semibold text-white">We build our own tools</div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">
              When off-the-shelf falls short — and it usually does — we build what&apos;s needed. Custom infrastructure, not wrappers around someone else&apos;s API.
            </p>
          </div>
          <div>
            <div className="text-[14px] font-semibold text-white">Built for your workflow</div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">
              We design the bot around your actual process and constraints — not a generic template. You get something that fits how your business already runs.
            </p>
          </div>
          <div>
            <div className="text-[14px] font-semibold text-white">Real person, real accountability</div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-400">
              Not an anonymous agency. Adam is a real person, U.S.-based, with a public reputation on every build.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-[15px] font-semibold text-black transition-all duration-200 hover:scale-[1.02] hover:bg-zinc-100"
            href="tel:+16037484982"
          >
            Call/text Adam: (603) 748-4982
          </a>
          <span className="text-[14px] text-zinc-500 sm:ml-2">
            Builds start at <span className="text-zinc-300 font-medium">$3,000</span> &middot; Billed at <span className="text-zinc-300 font-medium">$375/hr</span>
          </span>
        </div>
      </div>
      </div>
    </section>
  );
}
