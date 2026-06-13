export type IncomingLead = {
  name: string;
  phone?: string;
  email?: string;
  source?: string;
  budget?: string;
  timeline?: string;
};

export const automationFlow = [
  "Save lead",
  "Trigger AI call",
  "Collect qualification data",
  "Update CRM",
  "Book appointment",
  "Send confirmation",
  "Notify agent"
];

export async function triggerLeadAutomation(lead: IncomingLead) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      queued: false,
      message: "N8N_WEBHOOK_URL is not configured.",
      lead
    };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: "lead.created",
      agentName: "RealtorAI Assistant",
      lead
    })
  });

  return {
    queued: response.ok,
    status: response.status
  };
}
