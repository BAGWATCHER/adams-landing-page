export function Pricing() {
  return (
    <div className="space-y-10">

      {/* How this is priced */}
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">How this is priced</p>
        <p className="text-[14px] leading-relaxed text-zinc-300">
          Everything is custom — scope, integrations, workflow complexity all vary. Consulting is <span className="text-white font-medium">$375/hr</span>. Most first projects start around <span className="text-white font-medium">$3K</span> for a focused single workflow.
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-zinc-400">
          No retainer. No long contracts. You get a scoped estimate before any work begins — and you only pay for what gets built.
        </p>
      </div>

      {/* Industry context */}
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">What this normally costs</p>
        <p className="text-[13px] leading-relaxed text-zinc-400 mb-4">
          AI development is expensive. Here&apos;s what the market looks like so you can make sense of the numbers:
        </p>
        <div className="space-y-3">
          {[
            {
              label: "Enterprise AI agencies",
              detail: "Firms like Accenture, Deloitte, and boutique AI shops typically start at $50K–$500K+ for custom builds. Hourly agency rates run $450–$600/hr once you factor in overhead.",
              href: "https://digitalagencynetwork.com/ai-agency-pricing/",
              linkText: "AI agency pricing guide →",
            },
            {
              label: "Independent AI consultants",
              detail: "Top-tier independents charge $300–$500/hr. Mid-tier ranges from $150–$300/hr. Prototypes and POCs typically run $20K–$60K.",
              href: "https://www.leanware.co/insights/how-much-does-an-ai-consultant-cost",
              linkText: "AI consultant cost breakdown →",
            },
            {
              label: "Custom AI agents",
              detail: "A purpose-built AI agent — connected to your tools and trained on your data — typically runs $10K–$80K through a development shop.",
              href: "https://www.kumohq.co/blog/cost-to-build-an-ai-agent",
              linkText: "Cost to build an AI agent →",
            },
          ].map((r) => (
            <div key={r.label} className="rounded-md bg-white/[0.04] p-4">
              <div className="text-[13px] font-semibold text-zinc-200">{r.label}</div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">{r.detail}</p>
              <a
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-[12px] text-[var(--accent)] hover:underline"
              >
                {r.linkText}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* What drives cost */}
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">What affects the price</p>
        <div className="space-y-2.5 text-[13px]">
          {[
            { factor: "Number of integrations", detail: "Each tool connection (CRM, calendar, email, database) adds scoping, auth, and testing. 1 integration vs. 5 is a meaningful difference." },
            { factor: "Number of channels", detail: "Deploying to web chat is simple. Adding SMS, Telegram, Slack, and email all need separate connectors and routing logic." },
            { factor: "Workflow complexity", detail: "A bot that answers questions is simpler than one that runs a multi-step process with validation, approvals, and structured output." },
            { factor: "Knowledge base size", detail: "RAG setup (searching your docs) adds indexing, chunking, retrieval tuning, and accuracy testing." },
            { factor: "Ongoing support", detail: "Post-launch monitoring, updates, and iteration billed at consulting rate. Most clients do a small monthly block of hours." },
          ].map((f) => (
            <div key={f.factor} className="flex gap-2.5">
              <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] opacity-70" />
              <div>
                <span className="font-medium text-zinc-200">{f.factor}: </span>
                <span className="text-zinc-400">{f.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement model */}
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">How an engagement works</p>
        <ol className="space-y-4">
          {[
            { n: "1", step: "Discovery call", desc: "30–60 minutes. We map your workflow, find the highest-friction point, and agree on a scope for v1. No proposal until we understand the problem." },
            { n: "2", step: "Scoped build", desc: "You get a fixed scope and a rate estimate before we start. We build the first working version fast — most v1s are done in under 2 weeks." },
            { n: "3", step: "Ship and test", desc: "You use it in your real workflow. We fix edge cases, tune behavior, and handle anything that comes up. No extra charge for reasonable iteration during the build phase." },
            { n: "4", step: "Expand", desc: "Once it's running and you see the value, we scope what's next — more integrations, more channels, team rollout. Billed hourly as we go." },
          ].map((s) => (
            <li key={s.n} className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 text-[11px] font-bold text-[var(--accent)]">{s.n}</span>
              <div>
                <div className="text-[13px] font-semibold text-white">{s.step}</div>
                <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-400">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Vs alternatives */}
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">Compared to alternatives</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="pb-2 pr-3 text-left font-medium text-zinc-500"></th>
                <th className="pb-2 px-3 text-left font-medium text-zinc-500">ChatGPT Plus</th>
                <th className="pb-2 px-3 text-left font-medium text-zinc-500">Agency</th>
                <th className="pb-2 pl-3 text-left font-medium text-[var(--accent)]">Us</th>
              </tr>
            </thead>
            <tbody className="text-zinc-400">
              {[
                { label: "Cost", vals: ["$20/mo + your time", "$50K–$500K+", "From $3K"] },
                { label: "Integrations", vals: ["Manual copy-paste", "Usually", "Yes, direct API"] },
                { label: "Remembers you", vals: ["Somewhat", "Varies", "Yes, by design"] },
                { label: "Speed to v1", vals: ["Instant", "Months", "Days–2 weeks"] },
                { label: "Runs 24/7", vals: ["No", "Usually", "Yes"] },
              ].map((row) => (
                <tr key={row.label} className="border-b border-white/[0.04]">
                  <td className="py-2 pr-3 font-medium text-zinc-400">{row.label}</td>
                  {row.vals.map((v, i) => (
                    <td key={i} className={`py-2 px-3 ${i === 3 ? "font-medium text-white pl-3" : ""}`}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
