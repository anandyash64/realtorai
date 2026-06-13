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
import type { ChartPoint } from "@/lib/supabase/types";

export function SimpleChart({
  data,
  type = "leads"
}: {
  data: ChartPoint[];
  type?: "leads" | "appointments" | "conversion";
}) {
  return (
    <div className="rounded-lg border border-line bg-white p-5 shadow-card">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-semibold text-ink">
          {type === "leads" && "Leads by Day"}
          {type === "appointments" && "Appointments by Day"}
          {type === "conversion" && "Conversion Rate"}
        </h3>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">This week</span>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#E6EAF0" vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip
              cursor={{ fill: "#F7F9FC" }}
              contentStyle={{
                border: "1px solid #E6EAF0",
                borderRadius: 8,
                boxShadow: "0 1px 2px rgba(7, 10, 18, 0.06)"
              }}
            />
            <Bar dataKey={type} fill="#2563EB" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
