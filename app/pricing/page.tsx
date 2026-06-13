import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { plans } from "@/lib/data";

export default function PricingPage() {
  return (
    <div className="bg-white">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold tracking-tight text-ink">Pricing</h1>
          <p className="mt-5 text-lg leading-8 text-muted">
            Choose the operating system for your real estate lead response workflow.
          </p>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg border p-6 shadow-card ${
                plan.featured ? "border-blue-600 bg-ink text-white" : "border-line bg-white"
              }`}
            >
              <div className="text-lg font-bold">{plan.name} Plan</div>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                <span className={plan.featured ? "text-blue-100" : "text-muted"}>{plan.cadence}</span>
              </div>
              <ul className="mt-8 grid gap-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className={plan.featured ? "text-blue-100" : "text-blue-700"}>+</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                href={plan.href}
                variant={plan.featured ? "secondary" : "primary"}
                className="mt-8 w-full"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
