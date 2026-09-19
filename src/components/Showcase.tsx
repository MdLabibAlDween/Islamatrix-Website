import type { PortfolioItem, Service } from "@/lib/types";
import { HeroSample } from "./ServiceProofSection";
import GradientTitle from "./Title";

/** Large editorial spotlight — breaks the card rhythm with a magazine-style split. */
export function FeaturedService({ service, item, calendlyUrl }: {
  service: Service;
  item?: PortfolioItem;
  calendlyUrl: string;
}) {
  return (
    <section className="px-5 py-16 scroll-mt-20 overflow-hidden">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        <div className="relative">
          <div className="absolute -left-24 top-1/3 w-72 h-72 rounded-full blur-[110px] opacity-40" style={{ background: service.accent_color }} />
          <p className="relative text-xs uppercase tracking-[0.2em] font-bold" style={{ color: service.accent_color }}>
            Featured spotlight
          </p>
          <h2 className="relative mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
            {service.title} <span className="text-gradient">done right.</span>
          </h2>
          <p className="relative mt-4 text-zinc-400 leading-relaxed max-w-xl">{service.long_desc || service.short_desc}</p>
          <div className="relative mt-6 flex flex-wrap gap-3">
            <a href={calendlyUrl} target="_blank" rel="noreferrer" className="btn-primary px-7 py-3.5 text-sm">Start with {service.title} ↗</a>
            <a href={`#work-${service.slug}`} className="px-7 py-3.5 rounded-full border border-white/15 text-sm font-semibold hover:bg-white/10 round-btn">All samples</a>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 rounded-[2.5rem] opacity-25 blur-2xl" style={{ background: `linear-gradient(135deg, ${service.accent_color}, transparent)` }} />
          <div className="relative -rotate-1 hover:rotate-0 transition-transform duration-500">
            {item ? (
              <HeroSample item={item} service={service} />
            ) : (
              <div className="aspect-video grid place-items-center rounded-3xl border border-white/10 bg-white/[0.03] text-6xl">{service.icon_emoji}</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { n: "01", title: "Book a free strategy call", desc: "Tell us about your business, goals, and current challenges. We will identify which service or combination of services can help most." },
  { n: "02", title: "Get a clear plan and quote", desc: "Receive a practical scope of work, timeline, deliverables, and pricing before production begins." },
  { n: "03", title: "We create and execute", desc: "Our agency executes your project while keeping communication clear and organized in a single thread — planned, produced, and delivered without you chasing anyone." },
  { n: "04", title: "Launch and improve", desc: "We deliver the work, collect feedback, and provide support or ongoing optimization where needed." },
];

/** Simple process timeline — visual breather between galleries and team. */
export function Process({ label, title, highlight, sub, steps }: {
  label?: string;
  title?: string;
  highlight?: string;
  sub?: string;
  steps?: { n: string; title: string; desc: string }[];
}) {
  const list = steps ?? STEPS;
  return (
    <section className="px-5 py-16 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-violet-300 font-bold">{label ?? "How it works"}</p>
          <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-tight"><GradientTitle title={title ?? "From First Call to Final Delivery"} highlight={highlight ?? "Final Delivery"} /></h2>
          {(sub ?? "A simple process keeps your project organized, transparent, and focused on business outcomes.") && (
            <p className="mt-3 text-zinc-400">{sub ?? "A simple process keeps your project organized, transparent, and focused on business outcomes."}</p>
          )}
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {list.map((s) => (
            <div key={s.n} className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-6 overflow-hidden">
              <span className="text-5xl font-black text-white/[0.07] absolute -top-1 right-3">{s.n}</span>
              <p className="text-xs font-black tracking-widest text-violet-300">{s.n}</p>
              <h3 className="mt-2 font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
