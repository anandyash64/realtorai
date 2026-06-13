export const integrations = {
  calendly: {
    env: "NEXT_PUBLIC_CALENDLY_URL",
    purpose: "Embeds booking and stores confirmed appointment events."
  },
  vapi: {
    env: "NEXT_PUBLIC_VAPI_ASSISTANT_ID",
    purpose: "Runs RealtorAI Assistant voice calls and qualification."
  },
  twilio: {
    env: "TWILIO_ACCOUNT_SID",
    purpose: "Sends SMS confirmation and follow-up messages."
  },
  resend: {
    env: "RESEND_API_KEY",
    purpose: "Sends email confirmations, reminders, and summaries."
  },
  n8n: {
    env: "N8N_WEBHOOK_URL",
    purpose: "Orchestrates the new-lead automation flow."
  }
};
