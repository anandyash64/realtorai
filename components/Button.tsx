import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  className = ""
}: ButtonProps) {
  const base =
    "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition";
  const styles = {
    primary: "bg-ink text-white hover:bg-blue-700",
    secondary: "border border-line bg-white text-ink hover:border-blue-500 hover:text-blue-700",
    ghost: "text-muted hover:text-ink"
  };
  const classes = `${base} ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return <button className={classes}>{children}</button>;
}
