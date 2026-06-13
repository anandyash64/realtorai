import { AnalyticsPanels } from "@/components/AnalyticsPanels";
import { DashboardShell } from "@/components/DashboardShell";
import { SimpleChart } from "@/components/SimpleChart";
import { getAnalyticsData } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const analytics = await getAnalyticsData();

  return (
    <DashboardShell title="Analytics" subtitle="Lead sources, conversion, appointments, and monthly reporting.">
      <div className="grid gap-4 lg:grid-cols-2">
        <SimpleChart data={analytics.chartData} type="leads" />
        <SimpleChart data={analytics.chartData} type="appointments" />
        <SimpleChart data={analytics.chartData} type="conversion" />
        <AnalyticsPanels
          leadSources={analytics.leadSources}
          funnel={analytics.funnel}
          appointmentMetrics={analytics.appointmentMetrics}
        />
      </div>
    </DashboardShell>
  );
}
