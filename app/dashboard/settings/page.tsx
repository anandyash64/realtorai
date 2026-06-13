import { DashboardShell } from "@/components/DashboardShell";

const fields = [
  "User Information",
  "Company Name",
  "Phone Number",
  "Business Hours",
  "Calendar Integration",
  "Twilio Integration",
  "Vapi Integration",
  "Email Integration"
];

export default function SettingsPage() {
  return (
    <DashboardShell title="Settings" subtitle="Configure your profile, integrations, and routing rules.">
      <div className="grid gap-4 lg:grid-cols-2">
        {fields.map((field) => (
          <section key={field} className="rounded-lg border border-line bg-white p-5 shadow-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-ink">{field}</h2>
                <p className="mt-1 text-sm text-muted">
                  {field.includes("Integration")
                    ? "Connect API credentials and sync status."
                    : "Manage account and business preferences."}
                </p>
              </div>
              <label className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-blue-600">
                <input type="checkbox" className="sr-only" defaultChecked />
                <span className="ml-6 size-4 rounded-full bg-white" />
              </label>
            </div>
            <div className="mt-5 grid gap-3">
              <input
                className="focus-ring h-11 rounded-md border border-line px-3 text-sm"
                placeholder={field}
              />
            </div>
          </section>
        ))}
      </div>
    </DashboardShell>
  );
}
