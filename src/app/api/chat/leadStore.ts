import fs from "node:fs/promises";
import path from "node:path";

export type Lead = {
  createdAt: string;
  source: "adam-landing";
  kind: "inbound";
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
  };
  qualifiers?: Record<string, any>;
  lastUserMessage: string;
  transcript: Array<{ role: string; content: string }>;
};

const LEADS_PATH =
  process.env.LEADS_PATH ||
  "/home/ubuntu/clawd/apps/adam-landing/leads.jsonl";

export async function appendLead(lead: Lead): Promise<void> {
  const dir = path.dirname(LEADS_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.appendFile(LEADS_PATH, JSON.stringify(lead) + "\n", "utf8");
}
