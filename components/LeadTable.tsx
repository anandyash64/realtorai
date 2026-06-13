"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { displayDate } from "@/lib/format";
import type { Lead } from "@/lib/supabase/types";

type LeadForm = {
  name: string;
  phone: string;
  email: string;
  status: string;
  budget: string;
  timeline: string;
  source: string;
};

const emptyForm: LeadForm = {
  name: "",
  phone: "",
  email: "",
  status: "New",
  budget: "",
  timeline: "",
  source: ""
};

function toForm(lead: Lead): LeadForm {
  return {
    name: lead.name,
    phone: lead.phone ?? "",
    email: lead.email ?? "",
    status: lead.status,
    budget: lead.budget ?? "",
    timeline: lead.timeline ?? "",
    source: lead.source ?? ""
  };
}

export function LeadTable({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<LeadForm>(emptyForm);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const statuses = useMemo(
    () => Array.from(new Set(leads.map((lead) => lead.status).filter(Boolean))),
    [leads]
  );
  const sources = useMemo(
    () => Array.from(new Set(leads.map((lead) => lead.source).filter(Boolean))) as string[],
    [leads]
  );
  const filteredLeads = useMemo(() => {
    const normalizedQuery = query.toLowerCase();

    return leads.filter((lead) => {
      const matchesQuery = [lead.name, lead.phone, lead.email, lead.budget, lead.timeline]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));
      const matchesStatus = status ? lead.status === status : true;
      const matchesSource = source ? lead.source === source : true;

      return matchesQuery && matchesStatus && matchesSource;
    });
  }, [leads, query, source, status]);

  function updateForm(key: keyof LeadForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startCreate() {
    setEditingLead(null);
    setForm(emptyForm);
    setMessage("");
    setShowCreate(true);
  }

  function startEdit(lead: Lead) {
    setEditingLead(lead);
    setForm(toForm(lead));
    setMessage("");
    setShowCreate(true);
  }

  async function saveLead() {
    setSaving(true);
    setMessage("");

    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("You must be logged in to save leads.");

      const payload = {
        user_id: user.id,
        name: form.name,
        phone: form.phone || null,
        email: form.email || null,
        status: form.status || "New",
        budget: form.budget || null,
        timeline: form.timeline || null,
        source: form.source || null
      };

      const result = editingLead
        ? await supabase.from("leads").update(payload).eq("id", editingLead.id)
        : await supabase.from("leads").insert(payload);

      if (result.error) throw result.error;

      setShowCreate(false);
      setEditingLead(null);
      setForm(emptyForm);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save lead.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteLead(lead: Lead) {
    setSaving(true);
    setMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase.from("leads").delete().eq("id", lead.id);

      if (error) throw error;
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete lead.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white shadow-card">
      <div className="grid gap-3 border-b border-line p-4 md:grid-cols-[1fr_auto_auto_auto]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="focus-ring h-11 rounded-md border border-line px-3 text-sm"
          placeholder="Search leads"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="focus-ring h-11 rounded-md border border-line px-3 text-sm"
        >
          <option value="">Status</option>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={source}
          onChange={(event) => setSource(event.target.value)}
          className="focus-ring h-11 rounded-md border border-line px-3 text-sm"
        >
          <option value="">Source</option>
          {sources.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button
          onClick={startCreate}
          className="focus-ring h-11 rounded-md bg-ink px-4 text-sm font-semibold text-white"
        >
          Create Lead
        </button>
      </div>

      {showCreate ? (
        <div className="border-b border-line bg-cloud p-4">
          <div className="grid gap-3 md:grid-cols-4">
            <input
              value={form.name}
              onChange={(event) => updateForm("name", event.target.value)}
              className="focus-ring h-11 rounded-md border border-line px-3 text-sm"
              placeholder="Name"
            />
            <input
              value={form.phone}
              onChange={(event) => updateForm("phone", event.target.value)}
              className="focus-ring h-11 rounded-md border border-line px-3 text-sm"
              placeholder="Phone"
            />
            <input
              value={form.email}
              onChange={(event) => updateForm("email", event.target.value)}
              className="focus-ring h-11 rounded-md border border-line px-3 text-sm"
              placeholder="Email"
            />
            <input
              value={form.status}
              onChange={(event) => updateForm("status", event.target.value)}
              className="focus-ring h-11 rounded-md border border-line px-3 text-sm"
              placeholder="Status"
            />
            <input
              value={form.budget}
              onChange={(event) => updateForm("budget", event.target.value)}
              className="focus-ring h-11 rounded-md border border-line px-3 text-sm"
              placeholder="Budget"
            />
            <input
              value={form.timeline}
              onChange={(event) => updateForm("timeline", event.target.value)}
              className="focus-ring h-11 rounded-md border border-line px-3 text-sm"
              placeholder="Timeline"
            />
            <input
              value={form.source}
              onChange={(event) => updateForm("source", event.target.value)}
              className="focus-ring h-11 rounded-md border border-line px-3 text-sm"
              placeholder="Lead Source"
            />
            <div className="flex gap-2">
              <button
                onClick={saveLead}
                disabled={saving || !form.name}
                className="focus-ring h-11 flex-1 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white disabled:opacity-50"
              >
                {saving ? "Saving" : editingLead ? "Save" : "Create"}
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="focus-ring h-11 rounded-md border border-line bg-white px-4 text-sm font-semibold text-ink"
              >
                Cancel
              </button>
            </div>
          </div>
          {message ? <p className="mt-3 text-sm font-medium text-blue-700">{message}</p> : null}
        </div>
      ) : null}

      {!showCreate && message ? (
        <p className="border-b border-line p-4 text-sm font-medium text-blue-700">{message}</p>
      ) : null}

      {leads.length === 0 ? (
        <div className="p-10 text-center">
          <h2 className="font-semibold text-ink">No leads yet</h2>
          <p className="mt-2 text-sm text-muted">Create your first lead to start qualification.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[920px] w-full text-left text-sm">
            <thead className="bg-cloud text-xs uppercase tracking-wide text-muted">
              <tr>
                {[
                  "Name",
                  "Phone",
                  "Email",
                  "Status",
                  "Budget",
                  "Timeline",
                  "Lead Source",
                  "Created Date",
                  "Actions"
                ].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-4 py-4 font-semibold text-ink">{lead.name}</td>
                  <td className="px-4 py-4 text-muted">{lead.phone}</td>
                  <td className="px-4 py-4 text-muted">{lead.email}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-muted">{lead.budget}</td>
                  <td className="px-4 py-4 text-muted">{lead.timeline}</td>
                  <td className="px-4 py-4 text-muted">{lead.source}</td>
                  <td className="px-4 py-4 text-muted">{displayDate(lead.created_at)}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-3 font-semibold text-blue-700">
                      <Link href={`/dashboard/leads/${lead.id}`}>View</Link>
                      <button onClick={() => startEdit(lead)}>Edit</button>
                      <button onClick={() => deleteLead(lead)} className="text-muted">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLeads.length === 0 ? (
            <div className="border-t border-line p-8 text-center text-sm text-muted">
              No leads match the current filters.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
