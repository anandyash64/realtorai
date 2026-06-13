import { createServerSupabaseClient, createServiceClient } from "./server";
import type {
  AppUser,
  Appointment,
  AppointmentMetrics,
  Call,
  ChartPoint,
  FunnelStep,
  Lead,
  LeadSourceBreakdown
} from "./types";

function percentValue(numerator: number, denominator: number) {
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 100);
}

function percent(numerator: number, denominator: number) {
  return `${percentValue(numerator, denominator)}%`;
}

function lastSixDays() {
  return Array.from({ length: 6 }).map((_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (5 - index));
    return date;
  });
}

function sameDay(value: string, day: Date) {
  const date = new Date(value);
  return (
    date.getFullYear() === day.getFullYear() &&
    date.getMonth() === day.getMonth() &&
    date.getDate() === day.getDate()
  );
}

function statusMatches(status: string | null, accepted: string[]) {
  return accepted.some((item) => item.toLowerCase() === String(status ?? "").toLowerCase());
}

function buildChartData(leads: Pick<Lead, "created_at">[], appointments: Pick<Appointment, "date">[]) {
  return lastSixDays().map((day) => {
    const leadCount = leads.filter((lead) => sameDay(lead.created_at, day)).length;
    const appointmentCount = appointments.filter((appointment) => sameDay(appointment.date, day)).length;

    return {
      day: new Intl.DateTimeFormat("en", { weekday: "short" }).format(day),
      leads: leadCount,
      appointments: appointmentCount,
      conversion: percentValue(appointmentCount, leadCount)
    };
  }) satisfies ChartPoint[];
}

export async function getLeads() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Lead[];
}

export async function getLeadDetail(id: string) {
  const supabase = await createServerSupabaseClient();
  const [
    { data: lead, error: leadError },
    { data: appointments, error: appointmentError },
{ data: calls, error: callsError }
  ] = await Promise.all([
    supabase.from("leads").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("appointments")
      .select("*")
      .eq("lead_id", id)
      .order("date", { ascending: false }),
    supabase
      .from("calls")
      .select("*")
      .eq("lead_id", id)
      .order("created_at", { ascending: false })
  ]);

  if (leadError) throw leadError;
  if (appointmentError) throw appointmentError;
  if (callsError) throw callsError;

  return {
    lead: lead as Lead | null,
    appointments: (appointments ?? []) as Appointment[],
    calls: (calls ?? []) as Call[]
  };
}

export async function getAppointments() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*, leads(name)")
    .order("date", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Appointment[];
}

export async function getCalls() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("calls")
    .select("*, leads(name)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Call[];
}

export async function getDashboardData() {
  const supabase = await createServerSupabaseClient();
  const [
    usersResult,
    leadsResult,
    appointmentsResult,
    callsResult
  ] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id, status, created_at"),
    supabase.from("appointments").select("id, lead_id, status, date"),
    supabase.from("calls").select("id", { count: "exact", head: true })
  ]);

  if (leadsResult.error) throw leadsResult.error;
  if (appointmentsResult.error) throw appointmentsResult.error;

  const leads = (leadsResult.data ?? []) as Pick<Lead, "id" | "status" | "created_at">[];
  const appointments = (appointmentsResult.data ?? []) as Pick<Appointment, "id" | "status" | "date">[];
  const totalUsers = usersResult.count ?? 0;
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter((lead) =>
    statusMatches(lead.status, ["Qualified", "Appointment Booked"])
  ).length;
  const bookedAppointments = appointments.filter((appointment) => appointment.status === "Booked").length;
  const completedAppointments = appointments.filter((appointment) => appointment.status === "Completed").length;
  const callsMade = callsResult.count ?? 0;
  const totalAppointments = appointments.length;

  return {
    totalUsers,
    totalLeads,
    qualifiedLeads,
    bookedAppointments,
    totalAppointments,
    conversionRate: percent(bookedAppointments, totalLeads),
    callsMade,
    chartData: buildChartData(leads, appointments),
    monthlyPerformance: [
      { label: "Response SLA", value: percent(callsMade, totalLeads) },
      { label: "Qualified Rate", value: percent(qualifiedLeads, totalLeads) },
      { label: "Booked Rate", value: percent(bookedAppointments, totalLeads) },
      { label: "Completed Rate", value: percent(completedAppointments, totalAppointments) }
    ]
  };
}

export async function getAnalyticsData() {
  const supabase = await createServerSupabaseClient();
  const [
    { data: leads, error: leadsError },
    { data: appointments, error: appointmentError },
    { count: callsCount, error: callsError }
  ] = await Promise.all([
    supabase.from("leads").select("id, created_at, source, status"),
    supabase.from("appointments").select("id, status, date"),
    supabase.from("calls").select("id", { count: "exact", head: true })
  ]);

  if (leadsError) throw leadsError;
  if (appointmentError) throw appointmentError;
  if (callsError) throw callsError;

  const leadRows = (leads ?? []) as Pick<Lead, "id" | "created_at" | "source" | "status">[];
  const appointmentRows = (appointments ?? []) as Pick<Appointment, "id" | "lead_id" | "date" | "status">[];
  const totalLeads = leadRows.length;
  const qualifiedLeads = leadRows.filter((lead) =>
    statusMatches(lead.status, ["Qualified", "Appointment Booked"])
  ).length;
const bookedLeadIds = new Set(
  appointmentRows
    .filter((appointment) => appointment.status === "Booked")
    .map((appointment) => appointment.lead_id)
);

const completedLeadIds = new Set(
  appointmentRows
    .filter((appointment) => appointment.status === "Completed")
    .map((appointment) => appointment.lead_id)
);

const bookedAppointments = bookedLeadIds.size;
const completedAppointments = completedLeadIds.size;
  const cancelledAppointments = appointmentRows.filter((appointment) => appointment.status === "Cancelled").length;
  const noShowAppointments = appointmentRows.filter((appointment) => appointment.status === "No Show").length;
  const totalAppointments = appointmentRows.length;

  const sourceCounts = leadRows.reduce<Record<string, number>>((acc, lead) => {
    const source = lead.source || "Unknown";
    acc[source] = (acc[source] ?? 0) + 1;
    return acc;
  }, {});

  const leadSources: LeadSourceBreakdown[] = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([source, count]) => ({
      source,
      count,
      percentage: percentValue(count, totalLeads)
    }));

  const funnel: FunnelStep[] = [
    { label: "Leads", count: totalLeads, percentage: percentValue(totalLeads, totalLeads) },
    {
  label: "Calls",
  count: callsCount ?? 0,
  percentage: percentValue(callsCount ?? 0, totalLeads)
},
    { label: "Qualified", count: qualifiedLeads, percentage: percentValue(qualifiedLeads, totalLeads) },
    { label: "Booked", count: bookedAppointments, percentage: percentValue(bookedAppointments, totalLeads) },
    { label: "Completed", count: completedAppointments, percentage: percentValue(completedAppointments, totalLeads) }
  ];

  const appointmentMetrics: AppointmentMetrics = {
    booked: bookedAppointments,
    completed: completedAppointments,
    cancelled: cancelledAppointments,
    noShow: noShowAppointments,
    conversionRate: percent(bookedAppointments, totalLeads),
    completionRate: percent(completedAppointments, totalAppointments),
    noShowRate: percent(noShowAppointments, totalAppointments)
  };

  return {
    chartData: buildChartData(leadRows, appointmentRows),
    leadSources,
    funnel,
    appointmentMetrics
  };
}

export async function getAdminData() {
  const supabase = createServiceClient();
  const [usersResult, leadsResult, appointmentsResult, callsResult, qualifiedResult] =
    await Promise.all([
      supabase.from("users").select("id", { count: "exact", head: true }),
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase.from("appointments").select("id", { count: "exact", head: true }),
      supabase.from("calls").select("id", { count: "exact", head: true }),
      supabase.from("leads").select("id", { count: "exact", head: true }).in("status", [
        "Qualified",
        "Appointment Booked"
      ])
    ]);

  return {
    users: usersResult.count ?? 0,
    leads: leadsResult.count ?? 0,
    appointments: appointmentsResult.count ?? 0,
    calls: callsResult.count ?? 0,
    qualifiedLeads: qualifiedResult.count ?? 0
  };
}

export async function getAdminUsers() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, company, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as AppUser[];
}
