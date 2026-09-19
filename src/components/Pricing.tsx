import type { Service } from "@/lib/types";
import Link from "next/link";
import SectionHead from "./SectionHead";
import GradientTitle from "./Title";
import Reveal from "./Reveal";

export type PriceTier = { label: string; price: string };

// Estimate pricing per service (exact fee is always decided on the strategy
// call before work begins — stated under the grid).
export const ESTIMATE_PRICING: Record<string, PriceTier[]> = {
  "video-editing": [
    { label: "Shorts / Reels", price: "$100 – $500 per project" },
    { label: "YouTube / Promo", price: "$500 – $2,000 per project" },
  ],
  "lead-generation-crm": [
    { label: "Monthly retainer", price: "$300 – $1,500 per month" },
  ],
  "web-design-development": [
    { label: "WordPress / Portfolio", price: "$500 – $1,500 per project" },
    { label: "LMS / eCommerce", price: "$2,000 – $5,000+ per project" },
  ],
  "business-automation": [
    { label: "Single API workflow", price: "$200 – $500 per project" },
    { label: "Full backend pipeline", price: "$1,000 – $3,000+ per project" },
  ],
  "social-media-management": [
    { label: "2–3 platforms", price: "$300 – $800 per month" },
    { label: "Full strategy", price: "$1,000 – $2,500 per month" },
  ],
  "performance-marketing": [
    { label: "Monthly retainer", price: "$500 – $1,500 per month" },
    { label: "Ad spend fee", price: "10–15% of ad spend" },
  ],
  "ui-ux-graphic-design": [
    { label: "Banners / Logo", price: "$50 – $150 per project" },
    { label: "Full Figma UI prototype", price: "$1,000 – $3,500+ per project" },
  ],
  seo: [
    { label: "Local SEO", price: "$500 – $1,500 per month" },
    { label: "National / Competitive", price: "$2,000 – $5,000+ per month" },
  ],
  "copywriting-email": [
    { label: "Landing page copy", price: "$150 – $300 per project" },
    { label: "Email sequences", price: "$500 – $1,500 per month" },
  ],
};

export default function PricingSection({
  services,
  eyebrow,
  title,
  highlight,
  sub,
}: {
  services: Service[];
  eyebrow?: string;
  title?: string;
  highlight?: string;
  sub?: string;
}) {
  const cards = services.filter((s) => ESTIMATE_PRICING[s.slug]?.length);
  if (cards.length === 0) return null;
  return (
    <section id="pricing" className="px-5 py-16 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <SectionHead
          eyebrow={eyebrow ?? "Pricing"}
          title={<GradientTitle title={title ?? "Honest estimate pricing."} highlight={highlight ?? "estimate pricing."} />}
          sub={sub ?? "Estimates only — the exact fee is decided together on your strategy call before any work begins."}
        />
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cards.map((s, i) => (
            <Reveal key={s.slug} delay={Math.min(i, 8) * 60}>
              <div className="glass rounded-3xl p-6 flex flex-col h-full">
                <div className="flex items-center gap-3">
                  <span className="grid place-items-center w-11 h-11 shrink-0 rounded-2xl bg-white/5 border border-white/10 text-2xl">
                    {s.icon_emoji}
                  </span>
                  <h3 className="font-bold leading-tight">{s.title}</h3>
                </div>
                <ul className="mt-4 space-y-2.5 text-sm flex-1">
                  {ESTIMATE_PRICING[s.slug].map((t) => (
                    <li
                      key={t.label}
                      className="flex items-start justify-between gap-3 rounded-2xl bg-white/[0.03] border border-white/10 px-4 py-3"
                    >
                      <span className="text-zinc-300">{t.label}</span>
                      <span className="font-bold text-white text-right whitespace-nowrap">{t.price}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/#book" className="mt-4 text-xs font-semibold text-violet-300 hover:text-white">
                  Get exact quote →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-zinc-500">
          Estimate pricing only — the exact fee is decided together on your strategy call before any work begins.
        </p>
      </div>
    </section>
  );
}
