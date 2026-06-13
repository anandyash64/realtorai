import { NextResponse } from "next/server";
import { triggerLeadAutomation } from "@/lib/automation";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const payload = await request.json();
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("leads")
    .insert({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      source: payload.source ?? "Website",
      budget: payload.budget,
      timeline: payload.timeline,
      status: "New"
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const automation = await triggerLeadAutomation(payload);

  return NextResponse.json({
    lead: data,
    automation
  });
}
