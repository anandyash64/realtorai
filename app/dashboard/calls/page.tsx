import { CallsManager } from "@/components/CallsManager";
import { DashboardShell } from "@/components/DashboardShell";
import { getCalls, getLeads } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function CallsPage() {
  const [calls, leads] = await Promise.all([getCalls(), getLeads()]);

  return (
    <DashboardShell title="Calls" subtitle="Create, edit, and review AI call records.">
      <CallsManager calls={calls} leads={leads} />
    </DashboardShell>
  );
}
