"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { AppointmentMetrics, FunnelStep, LeadSourceBreakdown } from "@/lib/supabase/types";

export function AnalyticsPanels({
  leadSources,
  funnel,
  appointmentMetrics
}: {
  leadSources: LeadSourceBreakdown[];
  funnel: FunnelStep[];
  appointmentMetrics: AppointmentMetrics;
}) {
  return (
    <>
      <section className="rounded-lg border border-line bg-white p-5 shadow-card">
        <h2 className="font-semibold text-ink">Lead Sources</h2>
        <div className="mt-6 h-64">
          {leadSources.length === 0 ? (
            <p className="text-sm text-muted">No lead source data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadSources} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid stroke="#E6EAF0" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                <YAxis dataKey="source" type="category" tickLine={false} axisLine={false} fontSize={12} width={96} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563EB" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-line bg-white p-5 shadow-card">
        <h2 className="font-semibold text-ink">Conversion Funnel</h2>
        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <div className="mt-5 space-y-3">
  {funnel.map((step) => (
    <div
      key={step.label}
      className="flex items-center justify-between rounded-md bg-cloud p-3"
    >
      <span>{step.label}</span>
      <span className="font-bold">{step.count}</span>
    </div>
  ))}
</div>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-white p-5 shadow-card lg:col-span-2">
        <h2 className="font-semibold text-ink">Appointment Conversion Metrics</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <div className="rounded-md bg-cloud p-4">
            <div className="text-sm text-muted">Booked</div>
            <div className="mt-2 text-2xl font-bold text-ink">{appointmentMetrics.booked}</div>
          </div>
          <div className="rounded-md bg-cloud p-4">
            <div className="text-sm text-muted">Completed</div>
            <div className="mt-2 text-2xl font-bold text-ink">{appointmentMetrics.completed}</div>
          </div>
          <div className="rounded-md bg-cloud p-4">
            <div className="text-sm text-muted">Cancelled</div>
            <div className="mt-2 text-2xl font-bold text-ink">{appointmentMetrics.cancelled}</div>
          </div>
          <div className="rounded-md bg-cloud p-4">
            <div className="text-sm text-muted">No Show</div>
            <div className="mt-2 text-2xl font-bold text-ink">{appointmentMetrics.noShow}</div>
          </div>
          <div className="rounded-md bg-cloud p-4">
            <div className="text-sm text-muted">Booking Rate</div>
            <div className="mt-2 text-2xl font-bold text-ink">{appointmentMetrics.conversionRate}</div>
          </div>
          <div className="rounded-md bg-cloud p-4">
            <div className="text-sm text-muted">Completion Rate</div>
            <div className="mt-2 text-2xl font-bold text-ink">{appointmentMetrics.completionRate}</div>
          </div>
        </div>
      </section>
    </>
  );
}
