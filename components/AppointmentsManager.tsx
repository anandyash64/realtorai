"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { displayDate, displayTime } from "@/lib/format";
import type { Appointment, Lead } from "@/lib/supabase/types";

type AppointmentForm = {
  lead_id: string;
  date: string;
  status: Appointment["status"];
};

const emptyForm: AppointmentForm = {
  lead_id: "",
  date: "",
  status: "Booked"
};

function toInputDate(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function AppointmentsManager({
  appointments,
  leads
}: {
  appointments: Appointment[];
  leads: Lead[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<AppointmentForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function updateForm(key: keyof AppointmentForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, lead_id: leads[0]?.id ?? "" });
    setMessage("");
    setShowForm(true);
  }

  function startEdit(appointment: Appointment) {
    setEditingId(appointment.id);
    setForm({
      lead_id: appointment.lead_id,
      date: toInputDate(appointment.date),
      status: appointment.status
    });
    setMessage("");
    setShowForm(true);
  }

  async function saveAppointment() {
    setSaving(true);
    setMessage("");

    try {
      const supabase = createClient();
      const payload = {
        lead_id: form.lead_id,
        date: new Date(form.date).toISOString(),
        status: form.status
      };
      const result = editingId
        ? await supabase.from("appointments").update(payload).eq("id", editingId)
        : await supabase.from("appointments").insert(payload);

      if (result.error) throw result.error;

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save appointment.");
    } finally {
      setSaving(false);
    }
  }

  async function cancelAppointment(appointment: Appointment) {
    setSaving(true);
    setMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("appointments")
        .update({ status: "Cancelled" })
        .eq("id", appointment.id);

      if (error) throw error;
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to cancel appointment.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-semibold text-ink">List View</h2>
        <button
          onClick={startCreate}
          className="focus-ring rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white"
        >
          Create Appointment
        </button>
      </div>

      {showForm ? (
        <div className="mt-5 grid gap-3 rounded-md bg-cloud p-4">
          <div className="grid gap-3 md:grid-cols-3">
            <select
              value={form.lead_id}
              onChange={(event) => updateForm("lead_id", event.target.value)}
              className="focus-ring h-11 rounded-md border border-line px-3 text-sm"
            >
              <option value="">Select lead</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name}
                </option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={form.date}
              onChange={(event) => updateForm("date", event.target.value)}
              className="focus-ring h-11 rounded-md border border-line px-3 text-sm"
            />
            <select
              value={form.status}
              onChange={(event) => updateForm("status", event.target.value)}
              className="focus-ring h-11 rounded-md border border-line px-3 text-sm"
            >
              <option value="Booked">Booked</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No Show">No Show</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={saveAppointment}
              disabled={saving || !form.lead_id || !form.date}
              className="focus-ring rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Saving" : editingId ? "Save" : "Create"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="focus-ring rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
            >
              Cancel
            </button>
          </div>
          {message ? <p className="text-sm font-medium text-blue-700">{message}</p> : null}
        </div>
      ) : null}

      {!showForm && message ? <p className="mt-4 text-sm font-medium text-blue-700">{message}</p> : null}

      <div className="mt-5 grid gap-3">
        {appointments.length === 0 ? (
          <p className="rounded-md border border-line p-4 text-sm text-muted">
            No appointments booked yet.
          </p>
        ) : null}
        {appointments.map((appointment) => (
          <div key={appointment.id} className="rounded-md border border-line p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-ink">
                  {appointment.leads?.name ?? "Unknown lead"}
                </div>
                <div className="mt-1 text-sm text-muted">
                  {displayDate(appointment.date)} at {displayTime(appointment.date)}
                </div>
              </div>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {appointment.status}
              </span>
            </div>
            <div className="mt-4 flex gap-3 text-sm font-semibold text-blue-700">
              <button onClick={() => startEdit(appointment)}>Edit</button>
              <button
                onClick={() => cancelAppointment(appointment)}
                disabled={saving || appointment.status === "Cancelled"}
                className="text-muted disabled:opacity-50"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
