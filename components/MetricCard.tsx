export function MetricCard({
  label,
  value,
  change
}: {
  label: string;
  value: string;
  change?: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-white p-5 shadow-card">
      <div className="text-sm font-medium text-muted">{label}</div>
      <div className="mt-3 text-3xl font-bold tracking-tight text-ink">{value}</div>
      {change ? <div className="mt-2 text-sm font-semibold text-blue-600">{change}</div> : null}
    </div>
  );
}
