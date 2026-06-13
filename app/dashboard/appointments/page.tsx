import { AppointmentsManager } from "@/components/AppointmentsManager";
import { DashboardShell } from "@/components/DashboardShell";
import { getAppointments, getLeads } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  const [appointments, leads] = await Promise.all([getAppointments(), getLeads()]);

  return (
    <DashboardShell title="Appointment Management" subtitle="Calendar and list views for every booked meeting.">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-line bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-ink">Calendar View</h2>
            <div className="flex rounded-md border border-line p-1 text-sm">
              <button className="rounded bg-ink px-3 py-1.5 text-white">Week</button>
              <button className="px-3 py-1.5 text-muted">Month</button>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, index) => (
              <div
                key={index}
                className="min-h-24 rounded-md border border-line bg-cloud p-2 text-xs text-muted"
              >
                {index + 1}
                {appointments
                  .filter((appointment) => new Date(appointment.date).getDate() === index + 1)
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="mt-2 rounded bg-blue-600 px-2 py-1 font-semibold text-white"
                    >
                      {appointment.leads?.name ?? appointment.status}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </section>
        <AppointmentsManager appointments={appointments} leads={leads} />
      </div>
    </DashboardShell>
  );
}
