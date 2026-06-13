"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { displayDate } from "@/lib/format";
import type { Call, Lead } from "@/lib/supabase/types";

type CallForm = {
  lead_id: string;
  transcript: string;
  outcome: string;
  recording_url: string;
};

const emptyForm: CallForm = {
  lead_id: "",
  transcript: "",
  outcome: "",
  recording_url: ""
};

export function CallsManager({ calls, leads }: { calls: Call[]; leads: Lead[] }) {
  const router = useRouter();
  const [form, setForm] = useState<CallForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function updateForm(key: keyof CallForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, lead_id: leads[0]?.id ?? "" });
    setMessage("");
    setShowForm(true);
  }

  function startEdit(call: Call) {
    setEditingId(call.id);
    setForm({
      lead_id: call.lead_id,
      transcript: call.transcript ?? "",
      outcome: call.outcome ?? "",
      recording_url: call.recording_url ?? ""
    });
    setMessage("");
    setShowForm(true);
  }

  async function saveCall() {
    setSaving(true);
    setMessage("");

    try {
      const supabase = createClient();
      const payload = {
        lead_id: form.lead_id,
        transcript: form.transcript || null,
        outcome: form.outcome || null,
        recording_url: form.recording_url || null
      };
      const result = editingId
        ? await supabase.from("calls").update(payload).eq("id", editingId)
        : await supabase.from("calls").insert(payload);

      if (result.error) throw result.error;

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save call.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white shadow-card">
      <div className="flex items-center justify-between gap-4 border-b border-line p-4">
        <h2 className="font-semibold text-ink">Call Records</h2>
        <button
          onClick={startCreate}
          className="focus-ring rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white"
        >
          Create Call
        </button>
      </div>

      {showForm ? (
        <div className="border-b border-line bg-cloud p-4">
          <div className="grid gap-3">
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
                value={form.outcome}
                onChange={(event) => updateForm("outcome", event.target.value)}
                className="focus-ring h-11 rounded-md border border-line px-3 text-sm"
                placeholder="Outcome"
              />
              <input
                value={form.recording_url}
                onChange={(event) => updateForm("recording_url", event.target.value)}
                className="focus-ring h-11 rounded-md border border-line px-3 text-sm"
                placeholder="Recording URL"
              />
            </div>
            <textarea
              value={form.transcript}
              onChange={(event) => updateForm("transcript", event.target.value)}
              className="focus-ring min-h-32 rounded-md border border-line px-3 py-3 text-sm"
              placeholder="Transcript"
            />
            <div className="flex gap-2">
              <button
                onClick={saveCall}
                disabled={saving || !form.lead_id}
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
        </div>
      ) : null}

      {calls.length === 0 ? (
        <div className="p-10 text-center">
          <h2 className="font-semibold text-ink">No calls yet</h2>
          <p className="mt-2 text-sm text-muted">Create a call record after the first AI outreach.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead className="bg-cloud text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Lead</th>
                <th className="px-4 py-3 font-semibold">Outcome</th>
                <th className="px-4 py-3 font-semibold">Transcript</th>
                <th className="px-4 py-3 font-semibold">Created Date</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {calls.map((call) => (
                <tr key={call.id}>
                  <td className="px-4 py-4 font-semibold text-ink">{call.leads?.name ?? "Unknown lead"}</td>
                  <td className="px-4 py-4 text-muted">{call.outcome ?? "Not recorded"}</td>
                  <td className="max-w-md px-4 py-4 text-muted">{call.transcript ?? "No transcript"}</td>
                  <td className="px-4 py-4 text-muted">{displayDate(call.created_at)}</td>
                  <td className="px-4 py-4">
                    <button onClick={() => startEdit(call)} className="font-semibold text-blue-700">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
