// Contact section — strategy call via Calendly + project details via EmailJS form.
// NOTE: there is no backend inbox or client portal. Do NOT reintroduce one.

import ContactForm from "./ContactForm";
import GradientTitle from "./Title";
import type { Service } from "@/lib/types";

export default function BookingSection({
  calendlyUrl,
  email,
  title,
  highlight,
  sub,
  services,
  agencyName,
}: {
  calendlyUrl: string;
  email: string;
  title?: string;
  highlight?: string;
  sub?: string;
  services?: Service[];
  agencyName?: string;
}) {
  return (
    <section id="book" className="px-5 py-16 scroll-mt-20">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.4fr] gap-6">
        <div className="glass glow-border rounded-[2rem] p-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            <GradientTitle title={title ?? "Ready to Build, Market, and Grow?"} highlight={highlight ?? "Market, and Grow?"} />
          </h2>
          <p className="mt-3 text-zinc-400">
            {sub ?? "Tell us what your business needs. We will help you choose the right service, define the next steps, and create a clear plan without unnecessary complexity."}
          </p>

          <div className="mt-5 space-y-3">
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary block text-center px-6 py-4 text-sm"
            >
              Book a Free 30-Minute Call ↗
            </a>
            {email && (
              <a
                href={`mailto:${email}`}
                className="block text-center px-6 py-4 rounded-2xl border border-white/15 hover:bg-white/10 font-semibold text-sm round-btn"
              >
                Send Us an Email
              </a>
            )}
            <p className="text-xs text-zinc-500 text-center">
              No commitment required. Talk with a manager, discuss your goals, and receive practical next steps.
            </p>
          </div>

          <ul className="mt-6 text-sm text-zinc-300 space-y-2 border-t border-white/10 pt-5">
            <li>✓ Business Solutions for Muslim Businessmen</li>
            <li>✓ Exclusively for Muslim customers — strictly according to Shariah</li>
            <li>✓ No commitment — free consultation</li>
            <li>✓ Talk directly with a manager</li>
            <li>✓ Get a plan across 9 services</li>
            <li>✓ Everything managed in one place</li>
          </ul>
        </div>

        <div className="glass glow-border rounded-[2rem] overflow-hidden min-h-[480px]">
          <ContactForm email={email} services={services} agencyName={agencyName} />
        </div>
      </div>
    </section>
  );
}
