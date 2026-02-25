export function HowItWorks() {
  return (
    <div className="space-y-8">
      <p className="text-[14px] leading-relaxed text-zinc-400">
        This isn&apos;t ChatGPT with a system prompt. Here&apos;s what&apos;s actually running when you talk to a custom AI agent.
      </p>

      {/* Pipeline */}
      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">What happens on every message</h3>
        <ol className="space-y-4">
          {[
            { n: "1", title: "Intent routing", body: "A fast classifier reads your message and dispatches to the right sub-agent — no wasted LLM calls. Sales question, technical question, workflow task, or general conversation each go to a different handler with its own system prompt and context." },
            { n: "2", title: "Memory retrieval", body: "The agent loads your history, stored preferences, past decisions, and any relevant documents before it responds. You never re-explain yourself. It knows your CRM stage, your last three conversations, and your preferred email tone." },
            { n: "3", title: "Tool execution", body: "If the task requires it — checking a calendar, querying a database, pulling a CRM record, looking up order status — the agent calls the real API. Not a simulation. It gets a live result and uses it in the response." },
            { n: "4", title: "Model selection", body: "Fast models handle simple tasks. Powerful models handle complex reasoning. A scheduling confirmation costs a fraction of a cent. A 10-page document analysis uses a frontier model only when the task actually needs it." },
            { n: "5", title: "Response + memory write", body: "The response streams to you in real time. Anything worth keeping — a preference, a decision, project context — gets written back to memory for next time. The agent gets smarter the more you use it." },
          ].map((s) => (
            <li key={s.n} className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 text-[11px] font-bold text-[var(--accent)]">{s.n}</span>
              <div>
                <div className="text-[14px] font-semibold text-white">{s.title}</div>
                <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Sub-agents */}
      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">Multi-agent architecture</h3>
        <p className="text-[14px] text-zinc-400 mb-3">You talk to one assistant. These specialists run underneath:</p>
        <div className="space-y-2">
          {[
            { name: "Router", desc: "Classifies intent using heuristics first, LLM only as fallback. Keeps latency low and costs predictable." },
            { name: "Research agent", desc: "Searches your documents, knowledge base, or the web using retrieval-augmented generation. Grounds answers in real data — not hallucinations." },
            { name: "Task agent", desc: "Executes multi-step workflows: look up data → validate → call APIs → format output. Each step has guardrails. Sensitive actions pause for human approval." },
            { name: "Drafting agent", desc: "Writes emails, proposals, reports in your voice. Learns your tone and phrasing over time. Outputs drafts, not just suggestions." },
            { name: "Validation agent", desc: "Reviews outputs before they leave the system — flags errors, enforces business rules, catches edge cases before they reach a customer." },
          ].map((a) => (
            <div key={a.name} className="rounded-xl border border-[var(--border)] bg-white/[0.02] px-4 py-3">
              <div className="text-[13px] font-semibold text-[var(--accent)]">{a.name}</div>
              <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">Direct integrations</h3>
        <p className="text-[14px] text-zinc-400 mb-3">Every connection is a real API call — not Zapier, not a browser bot. The agent has scoped, authenticated access:</p>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            "Google Calendar / Outlook",
            "Slack / Telegram / SMS",
            "Salesforce / HubSpot / FUB",
            "PostgreSQL / MySQL / SQLite",
            "Google Sheets / Airtable",
            "Email (SendGrid / SMTP)",
            "Intercom / Zendesk",
            "Notion / Confluence",
            "Stripe / QuickBooks",
            "Custom REST or GraphQL APIs",
          ].map((t) => (
            <div key={t} className="rounded-lg border border-[var(--border)] bg-white/[0.02] px-3 py-2 text-[12px] text-zinc-300">
              {t}
            </div>
          ))}
        </div>
        <p className="mt-2 text-[12px] text-zinc-500">If it has an API, we can connect it.</p>
      </div>

      {/* Security */}
      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">Security &amp; privacy</h3>
        <div className="space-y-3">
          {[
            { label: "API-only model access", desc: "Your data goes through enterprise APIs with zero-retention agreements. Nothing trains public models." },
            { label: "Data isolation", desc: "Each client's memory, documents, and history are stored separately. No cross-contamination." },
            { label: "Scoped permissions", desc: "Read-only CRM for lookups. Write access to calendar for scheduling. The agent gets the minimum permission it needs — no more." },
            { label: "Full audit log", desc: "Every tool call, API request, and agent decision is logged. You can review exactly what it did and why at any time." },
            { label: "Human-in-the-loop", desc: "For high-stakes actions — sending to customers, writing records, moving money — the agent pauses and asks before executing." },
          ].map((s) => (
            <div key={s.label} className="flex gap-2.5 text-[13px]">
              <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] opacity-70" />
              <div><span className="font-medium text-zinc-200">{s.label}: </span><span className="text-zinc-400">{s.desc}</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* Infra */}
      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">Production infrastructure</h3>
        <div className="space-y-2 text-[13px] text-zinc-400">
          {[
            "Dedicated hosting with health checks and automated restarts",
            "Error tracking and alerting — we know when something breaks before you do",
            "Rate limiting and cost controls so a runaway loop doesn't burn through your API budget",
            "Encrypted at rest and in transit",
            "Regular backups of memory and agent configuration",
          ].map((item) => (
            <div key={item} className="flex gap-2.5">
              <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] opacity-70" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
