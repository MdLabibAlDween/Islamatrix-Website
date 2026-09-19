import "server-only";
import { getSupabasePublic } from "./supabase";
import {
  FALLBACK_MANAGERS,
  FALLBACK_SERVICES,
  FALLBACK_TEAM,
  FALLBACK_PORTFOLIO,
  FALLBACK_TESTIMONIALS,
  FIXED_FAQS,
} from "./fallback-data";
import { SERVICE_CONTENT, type ServiceContent } from "./service-content";
import { SITE, applyAgencyName } from "./site";
import type {
  Faq,
  PortfolioItem,
  Service,
  TeamMember,
  Testimonial,
} from "./types";

export type { ServiceContent };

export type SiteContent = {
  settings: Record<string, string>;
  services: Service[];
  team: TeamMember[];
  managers: TeamMember[];
  portfolio: PortfolioItem[];
  testimonials: Testimonial[];
  faqs: Faq[];
  details: Record<string, ServiceContent>;
};

export const DEFAULT_STATS = [
  { value: "9", label: "Specialized Services" },
  { value: "24h", label: "Response Time" },
  { value: "30min", label: "Free Strategy Call" },
];

export const DEFAULT_STEPS = [
  { n: "01", title: "Book a free strategy call", desc: "Tell us about your business, goals, and current challenges. We will identify which service or combination of services can help most." },
  { n: "02", title: "Get a clear plan and quote", desc: "Receive a practical scope of work, timeline, deliverables, and pricing before production begins." },
  { n: "03", title: "We create and execute", desc: "Our agency executes your project while keeping communication clear and organized in a single thread — planned, produced, and delivered without you chasing anyone." },
  { n: "04", title: "Launch and improve", desc: "We deliver the work, collect feedback, and provide support or ongoing optimization where needed." },
];

function fallbacks(): SiteContent {
  const details: Record<string, ServiceContent> = {};
  for (const [k, v] of Object.entries(SERVICE_CONTENT)) details[k] = v;
  return {
    settings: {},
    services: FALLBACK_SERVICES,
    team: FALLBACK_TEAM,
    managers: FALLBACK_MANAGERS,
    portfolio: FALLBACK_PORTFOLIO,
    testimonials: FALLBACK_TESTIMONIALS,
    faqs: FIXED_FAQS,
    details,
  };
}

/** Live content from Supabase; hardcoded fallbacks when DB is empty/unreachable. */
export async function getSiteContent(): Promise<SiteContent> {
  const fb = fallbacks();
  try {
    const sb = getSupabasePublic();
    const [svcRes, teamRes, portRes, testRes, faqRes, setRes, detRes] =
      await Promise.all([
        sb.from("services").select("*").eq("is_active", true).order("order_index"),
        sb.from("team_members").select("*").eq("is_active", true).order("order_index"),
        sb.from("portfolio_items").select("*").eq("is_active", true).order("order_index"),
        sb.from("testimonials").select("*").eq("is_active", true).order("order_index"),
        sb.from("faqs").select("*").eq("is_active", true).order("order_index"),
        sb.from("site_settings").select("key,value"),
        sb.from("service_details").select("*"),
      ]);

    const services = (svcRes.data as Service[] | null) ?? [];
    const team = (teamRes.data as TeamMember[] | null) ?? [];
    const managers = team.filter((t) => !t.is_founder);
    const portfolio = (portRes.data as PortfolioItem[] | null) ?? [];
    const testimonials = (testRes.data as Testimonial[] | null) ?? [];
    const faqs = (faqRes.data as Faq[] | null) ?? [];

    const settings: Record<string, string> = {};
    (((setRes.data as { key: string; value: string }[] | null) ?? [])).forEach(
      (r) => (settings[r.key] = r.value ?? "")
    );

    const details: Record<string, ServiceContent> = { ...fb.details };
    const detRows = (detRes.data as {
      service_slug: string;
      intro: string;
      benefits: string[];
      deliverables: string[];
      ideal_for: string[];
      faqs: { q: string; a: string }[];
      meta_title: string;
      meta_desc: string;
    }[] | null) ?? [];
    for (const d of detRows) {
      const base = fb.details[d.service_slug] ?? {
        cta: "Explore →",
        metaTitle: "",
        metaDesc: "",
        h1: "",
        intro: "",
        benefits: [],
        deliverables: [],
        idealFor: [],
        faqs: [],
      };
      details[d.service_slug] = {
        ...base,
        intro: d.intro || base.intro,
        benefits: d.benefits?.length ? d.benefits : base.benefits,
        deliverables: d.deliverables?.length ? d.deliverables : base.deliverables,
        idealFor: d.ideal_for?.length ? d.ideal_for : base.idealFor,
        faqs: d.faqs?.length ? d.faqs : base.faqs,
        metaTitle: d.meta_title || base.metaTitle,
        metaDesc: d.meta_desc || base.metaDesc,
      };
    }

    return brandSiteContent({
      settings,
      services: services.length ? services : fb.services,
      team: team.length ? team : fb.team,
      managers: managers.length ? managers : fb.managers,
      portfolio: portfolio.length ? portfolio : fb.portfolio,
      testimonials: testimonials.length ? testimonials : fb.testimonials,
      faqs: ensureHalalFaq(faqs.length ? faqs : fb.faqs),
      details,
    });
  } catch {
    return brandSiteContent({ ...fb, faqs: ensureHalalFaq(fb.faqs) });
  }
}

/** Agency name with fallback (empty string counts as unset).
 * Legacy "Lagency" is treated as unset so existing databases
 * automatically migrate to the new "Islamatrix" brand. */
export function getAgencyName(s: Record<string, string>): string {
  const v = s["agency_name"];
  const t = v !== undefined ? v.trim() : "";
  if (t === "" || t === "Lagency") return SITE.agencyName;
  return t;
}

/** "No samples" mode: true when the admin turned on hide_samples ("1").
 * Default (missing/empty/anything else) = false, i.e. samples are visible. */
export function samplesHidden(s: Record<string, string>): boolean {
  return (s["hide_samples"] ?? "").trim() === "1";
}

/** Halal / Muslim-only positioning FAQ — always present (injected if the DB lacks it). */
export const HALAL_FAQ = {
  id: "halal-muslim-only",
  question: "Do you offer Halal business solutions? Who can work with you?",
  answer:
    "Yes. Islamatrix offers Halal business solutions exclusively for Muslim businessmen. We only work with Muslim customers because every service is delivered strictly according to Shariah — from content and marketing to design, automation, and delivery.",
  order_index: 0,
  is_active: true,
} as Faq;

/** Prepends the Halal FAQ when the list has no Muslim-only Shariah entry. */
export function ensureHalalFaq(faqs: Faq[]): Faq[] {
  const has = faqs.some((f) =>
    /halal/i.test(`${f.question} ${f.answer}`) &&
    /muslim/i.test(`${f.question} ${f.answer}`)
  );
  if (has) return faqs;
  return [{ ...HALAL_FAQ }, ...faqs];
}

/**
 * Quick-brand: replaces every whole-word "Islamatrix" (plus legacy "Lagency")
 * in all display text
 * with the custom name from site_settings.agency_name.
 * Runs on read (no DB rewrite), so changing the name in Admin is instant
 * and reversible — set it back to "Islamatrix" to restore.
 */
export function brandSiteContent(c: SiteContent): SiteContent {
  const agency = getAgencyName(c.settings);
  // Even on the default brand, migrate legacy "Lagency" text to "Islamatrix"
  // (applyAgencyName handles this when agency is the default).
  const b = (t: string) => applyAgencyName(t ?? "", agency);
  const arr = (a: string[] | undefined) => (a ?? []).map((x) => b(x));
  const brandDetails = (d: ServiceContent): ServiceContent => ({
    ...d,
    metaTitle: b(d.metaTitle),
    metaDesc: b(d.metaDesc),
    h1: b(d.h1),
    intro: b(d.intro),
    benefits: arr(d.benefits),
    deliverables: arr(d.deliverables),
    idealFor: arr(d.idealFor),
    faqs: (d.faqs ?? []).map((f) => ({ q: b(f.q), a: b(f.a) })),
  });
  const details: Record<string, ServiceContent> = {};
  for (const [k, v] of Object.entries(c.details)) details[k] = brandDetails(v);
  // Also brand raw settings values (hero, section headings, stats/process JSON, …)
  // so parseStats/parseSteps and any direct s[key] reads pick up the new name.
  // URLs, emails and the key itself are left untouched.
  const settings: Record<string, string> = { ...c.settings };
  for (const [k, v] of Object.entries(settings)) {
    if (!v || k === "agency_name" || k.endsWith("_url") || k.endsWith("_email") || k === "logo_url") continue;
    settings[k] = applyAgencyName(v, agency);
  }
  return {
    settings,
    services: c.services.map((s) => ({
      ...s,
      title: b(s.title),
      short_desc: b(s.short_desc),
      long_desc: b(s.long_desc),
    })),
    team: c.team.map((t) => ({ ...t, bio: b(t.bio ?? "") })),
    managers: c.managers.map((t) => ({ ...t, bio: b(t.bio ?? "") })),
    portfolio: c.portfolio.map((p) => ({
      ...p,
      title: b(p.title),
      description: b(p.description ?? ""),
      client_name: b(p.client_name ?? ""),
    })),
    testimonials: c.testimonials.map((t) => ({
      ...t,
      quote: b(t.quote),
      client_name: b(t.client_name),
      client_role: b(t.client_role ?? ""),
    })),
    faqs: c.faqs.map((f) => ({ ...f, question: b(f.question), answer: b(f.answer) })),
    details,
  };
}

/** settings value with fallback (empty string counts as unset). Auto-applies Quick Brand. */
export function setting(
  s: Record<string, string>,
  key: string,
  fallback: string
): string {
  const v = s[key];
  const raw = v !== undefined && v !== "" ? v : fallback;
  if (!raw) return raw;
  // Never brand identifiers / links / contact data.
  if (key === "agency_name" || key.endsWith("_url") || key.endsWith("_email") || key === "logo_url") {
    return raw;
  }
  return applyAgencyName(raw, getAgencyName(s));
}

export function parseStats(raw: string | undefined): { value: string; label: string }[] {
  try {
    if (!raw) return DEFAULT_STATS;
    const arr = JSON.parse(raw) as { value?: unknown; label?: unknown }[];
    const out = arr
      .filter((x) => typeof x?.value === "string" && typeof x?.label === "string")
      .map((x) => ({ value: x.value as string, label: x.label as string }));
    return out.length ? out : DEFAULT_STATS;
  } catch {
    return DEFAULT_STATS;
  }
}

export function parseSteps(raw: string | undefined): { n: string; title: string; desc: string }[] {
  try {
    if (!raw) return DEFAULT_STEPS;
    const arr = JSON.parse(raw) as { n?: unknown; title?: unknown; desc?: unknown }[];
    const out = arr
      .filter((x) => typeof x?.title === "string")
      .map((x, i) => ({
        n: typeof x.n === "string" ? x.n : String(i + 1).padStart(2, "0"),
        title: x.title as string,
        desc: typeof x.desc === "string" ? x.desc : "",
      }));
    return out.length ? out : DEFAULT_STEPS;
  } catch {
    return DEFAULT_STEPS;
  }
}
