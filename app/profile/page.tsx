import { AuthForm } from "@/components/AuthForm";
import { DashboardShell } from "@/components/DashboardShell";

export default function ProfilePage() {
  return (
    <DashboardShell title="User Profile" subtitle="Manage your Supabase Auth profile.">
      <AuthForm mode="profile" />
    </DashboardShell>
  );
}
