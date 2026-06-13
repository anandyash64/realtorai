import { DashboardShell } from "@/components/DashboardShell";
import { agentQuestions } from "@/lib/data";
import { displayDate, displayTime } from "@/lib/format";
import { getLeadDetail } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { lead, appointments, calls } = await getLeadDetail(id);

  if (!lead) {
    return (
      <DashboardShell title="Lead not found" subtitle="This lead does not exist or is not available.">
        <section className="rounded-lg border border-line bg-white p-5 shadow-card">
          <p className="text-sm text-muted">No lead record was returned from Supabase.</p>
        </section>
      </DashboardShell>
    );
  }

  const latestCall = calls[0];
  const qualificationAnswers = lead.qualification_answers ?? {};

  return (
    <DashboardShell title={lead.name} subtitle="Lead information, call transcript, AI notes, and history.">
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="grid gap-4">
          <section className="rounded-lg border border-line bg-white p-5 shadow-card">
            <h2 className="font-semibold text-ink">Lead Information</h2>
            <dl className="mt-5 grid gap-3 text-sm">
              {[
                ["Phone", lead.phone],
                ["Email", lead.email],
                ["Status", lead.status],
                ["Budget", lead.budget],
                ["Timeline", lead.timeline],
                ["Lead Source", lead.source],
                ["Created Date", displayDate(lead.created_at)]
              ].map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 border-b border-line pb-3">
                  <dt className="text-muted">{key}</dt>
                  <dd className="font-medium text-ink">{value || "Not set"}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="rounded-lg border border-line bg-white p-5 shadow-card">
            <h2 className="font-semibold text-ink">Appointment History</h2>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-muted">
              {appointments.length === 0 ? <p>No appointments found.</p> : null}
              {appointments.map((appointment) => (
                <p key={appointment.id}>
                  {displayDate(appointment.date)} at {displayTime(appointment.date)}. Status: {appointment.status}.
                </p>
              ))}
            </div>
          </section>
        </div>
        <div className="grid gap-4">
          <section className="rounded-lg border border-line bg-white p-5 shadow-card">
            <h2 className="font-semibold text-ink">Call Transcript</h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              {latestCall?.transcript ?? "No call transcript found."}
            </p>
          </section>
          <section className="rounded-lg border border-line bg-white p-5 shadow-card">
            <h2 className="font-semibold text-ink">Qualification Answers</h2>
            <div className="mt-4 grid gap-3">
              {agentQuestions.map((question, index) => (
                <div key={question} className="rounded-md bg-cloud p-4">
                  <div className="text-sm font-semibold text-ink">{question}</div>
                  <div className="mt-1 text-sm text-muted">
                    {qualificationAnswers[question] ??
                      qualificationAnswers[String(index)] ??
                      "No response stored."}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-lg border border-line bg-white p-5 shadow-card">
            <h2 className="font-semibold text-ink">AI Notes</h2>
            <p className="mt-4 text-sm leading-6 text-muted">
              {lead.ai_notes ?? "No AI notes stored."}
            </p>
          </section>
          <section className="rounded-lg border border-line bg-white p-5 shadow-card">
            <h2 className="font-semibold text-ink">Communication History</h2>
            <div className="mt-4 grid gap-3 text-sm text-muted">
              {calls.length === 0 && appointments.length === 0 ? <p>No communication history found.</p> : null}
              {calls.map((call) => (
                <p key={call.id}>
                  Call on {displayDate(call.created_at)}. Outcome: {call.outcome ?? "Not recorded"}.
                </p>
              ))}
              {appointments.map((appointment) => (
                <p key={appointment.id}>
                  Appointment {appointment.status.toLowerCase()} for {displayDate(appointment.date)} at {displayTime(appointment.date)}.
                </p>
              ))}
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
