import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-muted sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <div className="font-bold text-ink">RealtorAI</div>
          <p className="mt-2 max-w-md">
            AI voice agents and automation for real estate lead response,
            qualification, and appointment booking.
          </p>
        </div>
        <div className="flex flex-wrap gap-5">
          <Link href="/pricing">Pricing</Link>
          <Link href="/demo">Demo</Link>
          <Link href="/login">Login</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </div>
    </footer>
  );
}
