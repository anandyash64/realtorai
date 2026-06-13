import { DashboardShell } from "@/components/DashboardShell";
import { displayDate } from "@/lib/format";
import { getAdminUsers } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <DashboardShell title="Admin Users" subtitle="All Supabase application users.">
      <div className="overflow-hidden rounded-lg border border-line bg-white shadow-card">
        {users.length === 0 ? (
          <div className="p-10 text-center">
            <h2 className="font-semibold text-ink">No users found</h2>
            <p className="mt-2 text-sm text-muted">Users will appear here after signup.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-left text-sm">
              <thead className="bg-cloud text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Company</th>
                  <th className="px-4 py-3 font-semibold">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-4 font-semibold text-ink">{user.name}</td>
                    <td className="px-4 py-4 text-muted">{user.email}</td>
                    <td className="px-4 py-4 text-muted">{user.company ?? "Not set"}</td>
                    <td className="px-4 py-4 text-muted">{displayDate(user.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
