import { DashboardShell } from "@/components/DashboardShell";
import { MetricCard } from "@/components/MetricCard";
import { getAdminData } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await getAdminData();

  return (
    <DashboardShell title="Admin Panel" subtitle="Manage users, leads, calls, analytics, and plans.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Users" value={String(admin.users)} />
        <MetricCard label="Leads" value={String(admin.leads)} />
        <MetricCard label="Appointments" value={String(admin.appointments)} />
        <MetricCard label="Calls" value={String(admin.calls)} />
        <MetricCard label="Qualified Leads" value={String(admin.qualifiedLeads)} />
      </div>
    </DashboardShell>
  );
}
