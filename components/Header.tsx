import Link from "next/link";
import { navItems } from "@/lib/data";
import { Button } from "./Button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid size-8 place-items-center rounded-md bg-ink text-sm text-white">
            AI
          </span>
          RealtorAI
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button href="/login" variant="ghost" className="hidden sm:inline-flex">
            Login
          </Button>
          <Button href="/demo">Book a Demo</Button>
        </div>
      </div>
    </header>
  );
}
