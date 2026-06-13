import { DashboardShell } from "@/components/DashboardShell";
import { MetricCard } from "@/components/MetricCard";
import { SimpleChart } from "@/components/SimpleChart";
import { getDashboardData } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const dashboard = await getDashboardData();

  return (
    <DashboardShell
      title="Dashboard"
      subtitle="Lead response, calls, appointments, and monthly performance."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Total Leads" value={String(dashboard.totalLeads)} change={`${dashboard.totalUsers} users`} />
        <MetricCard label="Qualified Leads" value={String(dashboard.qualifiedLeads)} change={`${dashboard.conversionRate} booked`} />
        <MetricCard label="Appointments Booked" value={String(dashboard.bookedAppointments)} change={`${dashboard.totalAppointments} total`} />
        <MetricCard label="Conversion Rate" value={dashboard.conversionRate} change={`${dashboard.bookedAppointments} booked`} />
        <MetricCard label="Calls Made" value={String(dashboard.callsMade)} change={`${dashboard.totalLeads} leads`} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <SimpleChart data={dashboard.chartData} type="leads" />
        <SimpleChart data={dashboard.chartData} type="appointments" />
      </div>
      <div className="mt-6 rounded-lg border border-line bg-white p-5 shadow-card">
        <h2 className="font-semibold text-ink">Monthly Performance</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {dashboard.monthlyPerformance.map((metric) => (
            <div key={metric.label} className="rounded-md bg-cloud p-4">
              <div className="text-sm text-muted">{metric.label}</div>
              <div className="mt-2 text-2xl font-bold text-ink">
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
