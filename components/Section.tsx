import type { ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  body,
  children,
  className = ""
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`border-t border-line py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          {eyebrow ? (
            <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
              {eyebrow}
            </div>
          ) : null}
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {title}
          </h2>
          {body ? <p className="mt-4 text-lg leading-8 text-muted">{body}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
