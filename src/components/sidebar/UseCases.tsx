const INDUSTRIES = [
  {
    name: "Real Estate",
    problem: "Leads come in from Zillow, your website, and referrals. Someone has to text them back within 5 minutes or they're gone. That falls on you or your agents — manually, all day.",
    flow: [
      "New lead hits your site or Zillow → agent texts them back in under 60 seconds",
      "Qualifies them: pre-approved? Timeline? Neighborhood preference?",
      "Books a showing directly into your calendar based on availability",
      "Logs everything into Follow Up Boss, Salesforce, or your CRM automatically",
      "Follows up 24h, 72h, 7 days later if no response — without you touching it",
    ],
    tools: "Follow Up Boss, Zillow webhooks, Google Calendar, Twilio SMS",
  },
  {
    name: "Trades & Service Businesses",
    problem: "Half your calls are people asking for quotes or availability. You're either answering them yourself or losing them to a competitor who responded faster.",
    flow: [
      "Call or text comes in → bot captures job type, urgency, location",
      "Categorizes it: emergency (leak, no heat) vs. routine (maintenance, quote request)",
      "Schedules a tech from your team based on zone and availability",
      "Generates a rough quote from your pricing sheet and sends it",
      "Follows up post-job for review or rebooking",
    ],
    tools: "ServiceTitan, Jobber, Google Calendar, Twilio, email",
  },
  {
    name: "Legal",
    problem: "Initial consultations are free but time-consuming. Most callers aren't a fit. Your staff is fielding calls that don't convert.",
    flow: [
      "Prospective client submits a form or sends a message",
      "Bot runs intake: case type, jurisdiction, timeline, opposing party",
      "Checks for basic conflict flags based on your existing client list",
      "If qualified, books a consult on your calendar with a pre-filled intake form",
      "Sends reminder, collects any documents needed before the call",
    ],
    tools: "Clio, Google Calendar, DocuSign, email",
  },
  {
    name: "E-commerce",
    problem: "Support tickets pile up — 80% of them are order status, returns, and 'where is my package.' Your team is buried in repetitive work instead of handling real issues.",
    flow: [
      "Customer asks a question in chat, email, or SMS",
      "Bot looks up their order in Shopify or your OMS in real time",
      "Answers status, shipping, return policy questions instantly",
      "Initiates a return or refund if it meets your policy criteria",
      "Escalates to a human only for edge cases — with full context already loaded",
    ],
    tools: "Shopify, Klaviyo, Gorgias, Intercom, email",
  },
  {
    name: "Professional Services",
    problem: "You spend hours a week on email triage, meeting prep, research, and follow-ups. It's not skilled work — it's coordination overhead that compounds.",
    flow: [
      "Morning briefing: here's what matters today, what's overdue, what needs a decision",
      "Drafts replies to emails in your voice — you review and send",
      "Preps you for meetings: who you're talking to, last conversation, open items",
      "Handles follow-up emails, scheduling, and task tracking after calls",
      "Researches topics, companies, or competitors and summarizes findings",
    ],
    tools: "Gmail, Google Calendar, Notion, Slack, HubSpot",
  },
  {
    name: "Finance & Insurance",
    problem: "Client onboarding is document-heavy and slow. Applications get stuck. Advisors spend time chasing paperwork instead of advising.",
    flow: [
      "Client receives a guided onboarding flow — collects docs, answers questions",
      "Bot validates completeness and flags missing items before it hits your desk",
      "Checks against compliance checklists automatically",
      "Summarizes the client profile and surfaces it to the advisor before the first meeting",
      "Sends reminders and status updates to the client throughout",
    ],
    tools: "Salesforce, DocuSign, email, internal databases",
  },
];

const OBJECTIONS = [
  {
    q: "Will AI replace my team?",
    a: "No — it handles the repetitive, low-judgment work that burns people out: answering the same questions, routing requests, chasing follow-ups. Your team focuses on the work that actually needs a human. Most clients find their team gets more done, not fewer people.",
  },
  {
    q: "What if we don't know where to start?",
    a: "That's normal — and it's why we start with a discovery call, not a proposal. We ask about your workflow, find the highest-friction point, and build there first. You don't need a complete AI strategy before building anything. Start with one workflow, prove the value, expand from there.",
  },
  {
    q: "What if our systems are too old or disconnected?",
    a: "We work with what you have. If there's an API, we connect to it. If there isn't, we can use read/write access to the database, or connect via webhooks. We don't require you to modernize your stack before building — we meet you where you are.",
  },
  {
    q: "How do we know the AI won't make mistakes?",
    a: "Every bot has guardrails. Sensitive actions — sending to customers, updating records, moving money — pause for a human review step before executing. You define where the AI acts autonomously and where it requires approval. And everything is logged, so you can audit exactly what it did and why.",
  },
  {
    q: "Is my data safer with a custom AI than ChatGPT?",
    a: "Significantly. ChatGPT processes your data through a consumer product. A custom build uses enterprise API access with zero-retention agreements — your data isn't logged or used for training. Your business context stays isolated to your system. It never touches OpenAI's training pipeline.",
  },
  {
    q: "What if the AI gives wrong information to a customer?",
    a: "The bot only answers what it's been given. It pulls from your docs, your pricing, your FAQs — not from the open internet. If it doesn't know the answer, it escalates to a human instead of guessing. You control the knowledge base and can update it any time.",
  },
];

export function UseCases() {
  return (
    <div className="space-y-10">
      {/* Industry verticals */}
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-wider text-zinc-500 mb-4">By industry</p>
        <div className="space-y-5">
          {INDUSTRIES.map((ind) => (
            <div key={ind.name} className="rounded-xl border border-[var(--border)] bg-white/[0.02] p-4">
              <div className="text-[14px] font-semibold text-white">{ind.name}</div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">{ind.problem}</p>
              <div className="mt-3 space-y-1.5">
                {ind.flow.map((step) => (
                  <div key={step} className="flex gap-2 text-[13px] text-zinc-300">
                    <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] opacity-70" />
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-[11px] text-zinc-600">
                <span className="text-zinc-500">Connects to:</span> {ind.tools}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Objection handling */}
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-wider text-zinc-500 mb-4">Common concerns</p>
        <div className="space-y-4">
          {OBJECTIONS.map((o) => (
            <div key={o.q}>
              <div className="text-[14px] font-semibold text-white">{o.q}</div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">{o.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
