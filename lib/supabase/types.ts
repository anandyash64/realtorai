export type Lead = {
  id: string;
  user_id: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  source: string | null;
  budget: string | null;
  timeline: string | null;
  status: string;
  qualification_answers: Record<string, string> | null;
  ai_notes: string | null;
  created_at: string;
};

export type AppUser = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  created_at: string;
};

export type Appointment = {
  id: string;
  lead_id: string;
  date: string;
  status: "Booked" | "Completed" | "Cancelled" | "No Show";
  calendly_event_uri: string | null;
  created_at: string;
  leads?: {
    name: string;
  } | null;
};

export type Call = {
  id: string;
  lead_id: string;
  transcript: string | null;
  outcome: string | null;
  recording_url: string | null;
  created_at: string;
  leads?: {
    name: string;
  } | null;
};

export type ChartPoint = {
  day: string;
  leads: number;
  appointments: number;
  conversion: number;
};

export type LeadSourceBreakdown = {
  source: string;
  count: number;
  percentage: number;
};

export type FunnelStep = {
  label: string;
  count: number;
  percentage: number;
};

export type AppointmentMetrics = {
  booked: number;
  completed: number;
  cancelled: number;
  noShow: number;
  conversionRate: string;
  completionRate: string;
  noShowRate: string;
};
