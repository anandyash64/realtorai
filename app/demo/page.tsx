import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function DemoPage() {
  const calendlyUrl =
    process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/realtorai/demo";

  return (
    <div className="bg-white">
      <Header />
      <main className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-ink">See RealtorAI in Action</h1>
          <p className="mt-5 text-lg leading-8 text-muted">Book a personalized demo.</p>
          <div className="mt-8 rounded-lg border border-line bg-cloud p-5">
            <div className="text-sm font-semibold text-ink">Demo agenda</div>
            <ul className="mt-4 grid gap-3 text-sm text-muted">
              <li>AI voice agent workflow</li>
              <li>Lead qualification and summaries</li>
              <li>Calendar booking and follow-up automation</li>
              <li>Supabase, Vapi, Twilio, Resend, and n8n architecture</li>
            </ul>
          </div>
        </div>
        <div className="min-h-[720px] overflow-hidden rounded-lg border border-line shadow-soft">
          <iframe
            title="Calendly booking"
            src={calendlyUrl}
            className="h-[720px] w-full"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
