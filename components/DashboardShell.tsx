import Link from "next/link";
import type { ReactNode } from "react";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/leads", label: "Leads" },
  { href: "/dashboard/appointments", label: "Appointments" },
  { href: "/dashboard/calls", label: "Calls" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/settings", label: "Settings" },
  { href: "/dashboard/admin", label: "Admin" },
  { href: "/dashboard/admin/users", label: "Admin Users" }
];

export function DashboardShell({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cloud">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-white p-5 lg:block">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="grid size-8 place-items-center rounded-md bg-ink text-sm text-white">
            AI
          </span>
          RealtorAI
        </Link>
        <nav className="mt-8 grid gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-cloud hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-line bg-white/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
              <p className="mt-1 text-sm text-muted">{subtitle}</p>
            </div>
            <div className="flex overflow-x-auto lg:hidden">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </header>
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
