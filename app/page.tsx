import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Section } from "@/components/Section";
import { WorkflowVisual } from "@/components/WorkflowVisual";
import { benefits, features, howItWorks, testimonials } from "@/lib/data";

export default function LandingPage() {
  return (
    <div className="bg-white">
      <Header />
      <main>
        <section className="overflow-hidden">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div>
              <div className="mb-5 inline-flex rounded-full border border-line bg-cloud px-3 py-1 text-sm font-semibold text-blue-700">
                AI lead response for real estate
              </div>
              <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-ink sm:text-6xl lg:text-7xl">
                Never Lose Another Real Estate Lead
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                Every lead gets contacted within 60 seconds, qualified
                automatically, and booked directly into your calendar.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/demo">Book a Demo</Button>
                <Button href="/demo" variant="secondary">
                  Watch Demo
                </Button>
              </div>
            </div>
            <WorkflowVisual />
          </div>
        </section>

        <Section
          eyebrow="How it works"
          title="From inquiry to booked appointment without manual chase."
          body="RealtorAI coordinates the first touch, qualification, booking, and agent handoff."
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {howItWorks.map((step, index) => (
              <div key={step.title} className="rounded-lg border border-line bg-white p-5 shadow-card">
                <div className="mb-5 grid size-10 place-items-center rounded-md bg-ink text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          className="bg-cloud"
          eyebrow="Features"
          title="Everything your team needs to qualify and convert leads."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {features.map((feature) => (
              <div key={feature} className="rounded-lg border border-line bg-white p-5 shadow-card">
                <div className="mb-4 grid size-9 place-items-center rounded-md bg-blue-50 text-xs font-bold text-blue-700">
                  AI
                </div>
                <h3 className="font-semibold text-ink">{feature}</h3>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Benefits" title="Built around the numbers that move pipeline.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {benefits.map((benefit) => (
              <div key={benefit.label} className="rounded-lg border border-line bg-ink p-5 text-white">
                <div className="text-4xl font-bold tracking-tight">{benefit.value}</div>
                <div className="mt-3 text-sm text-blue-100">{benefit.label}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          className="bg-cloud"
          eyebrow="Testimonials"
          title="Trusted by operators who cannot afford slow follow-up."
        >
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <figure key={testimonial.name} className="rounded-lg border border-line bg-white p-6 shadow-card">
                <blockquote className="text-sm leading-7 text-ink">
                  "{testimonial.quote}"
                </blockquote>
                <figcaption className="mt-6">
                  <div className="font-semibold text-ink">{testimonial.name}</div>
                  <div className="text-sm text-muted">{testimonial.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
