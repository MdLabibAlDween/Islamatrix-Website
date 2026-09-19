import type { Service } from "@/lib/types";
import { SERVICE_CONTENT } from "@/lib/service-content";
import { applyAgencyName } from "@/lib/site";
import GradientTitle from "./Title";
import Reveal from "./Reveal";

export default function Hero({
  calendlyUrl,
  eyebrow,
  title,
  highlight,
  creativeLine,
  trustLine,
  stats,
}: {
  calendlyUrl: string;
  eyebrow: string;
  title: string;
  highlight: string;
  creativeLine: string;
  trustLine: string;
  stats: { value: string; label: string }[];
}) {
  const parts = title.split(highlight);
  return (
    <section id="top" className="relative pt-28 pb-16 px-5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-violet-600/25 blur-[140px] rounded-full" />
        <div className="absolute top-40 -left-40 w-[400px] h-[400px] bg-rose-600/15 blur-[120px] rounded-full" />
        <div className="absolute top-64 -right-40 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm px-4 py-2 rounded-full glass text-zinc-200 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {eyebrow}
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]">
          {parts.length > 1 ? (
            <>
              {parts[0]} <span className="text-gradient">{highlight}</span> {parts[1]}
            </>
          ) : (
            title
          )}
        </h1>
        <p className="mt-4 text-lg sm:text-xl font-bold text-gradient">{creativeLine}</p>
        <div className="mt-8 inline-flex max-w-3xl items-center justify-center gap-2 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-xs sm:text-sm font-semibold text-emerald-100">
          <span>Offering Business Solutions to Muslim Businessmen — exclusively for Muslim customers, working strictly according to Shariah.</span>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href={calendlyUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-violet-300 transition-colors">
            Book a Free Strategy Call ↗
          </a>
          <a href="#services" className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/15 glass font-semibold hover:bg-white/10">
            Explore Our Services
          </a>
        </div>
        <p className="mt-5 text-xs text-zinc-500">{trustLine}</p>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl px-4 py-5">
              <div className="text-2xl sm:text-3xl font-extrabold">{s.value}</div>
              <div className="text-xs sm:text-sm text-zinc-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicesGrid({ services, eyebrow, title, highlight, sub, agencyName }: {
  services: Service[];
  eyebrow?: string;
  title?: string;
  highlight?: string;
  sub?: string;
  agencyName?: string;
}) {
  const eb = eyebrow ?? "Our Digital Business Services";
  const t = title ?? "Everything Your Business Needs to Grow Online";
  const hl = highlight ?? "Grow Online";
  const DEFAULT_SUB =
    "From content production to lead generation, Islamatrix brings the skills, strategy, and execution your business needs under one roof — strictly according to Shariah.";
  const displaySub = sub ?? applyAgencyName(DEFAULT_SUB, agencyName);
  return (
    <section id="services" className="px-5 py-10 min-h-screen flex items-center scroll-mt-20">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-violet-300 font-bold">
            {eb}
          </p>
          <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight">
            <GradientTitle title={t} highlight={hl} />
          </h2>
          {(displaySub) && (
            <p className="mt-3 text-zinc-400 text-sm sm:text-base">
              {displaySub}
            </p>
          )}
        </div>
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={Math.min(i, 8) * 60}>
            <a href={`/services/${s.slug}`} className="card-hover glass rounded-2xl p-3.5 sm:p-4 text-left block group h-full">
              <div className="flex items-center gap-2.5">
                <span className="grid place-items-center w-9 h-9 shrink-0 rounded-xl bg-white/5 border border-white/10 text-xl">{s.icon_emoji}</span>
                <h3 className="font-bold text-sm sm:text-[15px] leading-tight group-hover:text-violet-200">{s.title}</h3>
              </div>
              <p className="mt-2 hidden sm:block text-xs text-zinc-400 leading-relaxed line-clamp-2">{s.short_desc}</p>
              <span className="mt-2 hidden sm:inline-flex text-xs font-semibold text-white/60 group-hover:text-white">{SERVICE_CONTENT[s.slug]?.cta ?? "Explore →"}</span>
            </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
