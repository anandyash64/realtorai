import { DashboardShell } from "@/components/DashboardShell";
import { LeadTable } from "@/components/LeadTable";
import { getLeads } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <DashboardShell title="Lead Management" subtitle="Search, filter, view, edit, and delete leads.">
      <LeadTable leads={leads} />
    </DashboardShell>
  );
}
