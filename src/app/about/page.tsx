import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Sections";
import Reveal from "@/components/Reveal";
import GradientTitle from "@/components/Title";
import { getSiteContent, setting, getAgencyName, samplesHidden } from "@/lib/content";
import { SITE, applyAgencyName } from "@/lib/site";

export const dynamic = "force-dynamic";

const DEFAULT_FLOW = [
  { n: "01", title: "Book a call", desc: "Pick a time that suits you for a free 30-minute strategy call. No commitment, no pressure." },
  { n: "02", title: "Talk to the Founder or a Manager", desc: "Md Labib Al Dween or a manager from our agency joins the call, understands your goal, and maps the right services for it." },
  { n: "03", title: "We manage everything", desc: "Our agency plans, executes, and delivers your complete work — managed for you, all in one place." },
];

export async function generateMetadata(): Promise<Metadata> {
  let agencyName = SITE.agencyName;
  let name = "Md Labib Al Dween";
  let role = "Founder & CEO";
  try {
    const { settings } = await getSiteContent();
    agencyName = getAgencyName(settings);
    name = setting(settings, "about_name", name);
    role = setting(settings, "about_role", role);
  } catch {
    agencyName = SITE.agencyName;
  }
  const title = applyAgencyName(`About Me | ${name}, ${role} of Islamatrix`, agencyName);
  const description = applyAgencyName(
    `Meet ${name}, ${role} of Islamatrix — a digital growth agency covering video editing, web development, lead generation, automation, marketing, design, SEO, and copywriting.`,
    agencyName
  );
  return {
    title,
    description,
    alternates: { canonical: `${SITE.url}/about` },
    openGraph: { title, description, url: `${SITE.url}/about` },
  };
}

export default async function AboutPage() {
  const { settings: s } = await getSiteContent();
  const calendlyUrl = setting(s, "calendly_url", SITE.calendlyUrl);
  const agencyName = setting(s, "agency_name", SITE.agencyName);
  const email = setting(s, "contact_email", SITE.contactEmail);
  const logoUrl = s.logo_url?.trim() || SITE.logo;
  const hideSamples = samplesHidden(s);
  const portfolioUrl = (s.about_portfolio_url ?? "").trim() || "https://labibaldween.com";
  const eyebrow = setting(s, "about_eyebrow", "About Me");
  const name = setting(s, "about_name", "Md Labib Al Dween");
  const highlight = setting(s, "about_name_highlight", "Labib Al Dween");
  const role = setting(s, "about_role", "Founder & CEO");
  const intro = setting(
    s,
    "about_intro",
    `${agencyName} is a digital growth agency covering video editing, web development, lead generation, automation, marketing, design, SEO, and copywriting. You share your goal once — our agency plans, executes, and delivers everything, all in one place, with a single point of contact from start to finish.`
  );
  const flow = [1, 2, 3].map((n, i) => ({
    n: String(n).padStart(2, "0"),
    title: setting(s, `about_step${n}_title`, DEFAULT_FLOW[i].title),
    desc: setting(s, `about_step${n}_desc`, DEFAULT_FLOW[i].desc),
  }));

  return (
    <main
      className="text-zinc-100 min-h-screen"
      style={{ background: "var(--color-bg, #060606)" }}
    >
      <Navbar calendlyUrl={calendlyUrl} agencyName={agencyName} logoUrl={logoUrl} hideSamples={hideSamples} />

      <div className="max-w-6xl mx-auto px-5 pt-32 pb-4 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-violet-300 font-bold">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] max-w-3xl mx-auto">
          <GradientTitle title={name} highlight={highlight} />
        </h1>
        <p className="mt-3 inline-block rounded-full border border-violet-400/40 bg-violet-500/10 px-4 py-1.5 text-xs sm:text-sm font-bold text-violet-200">
          {role}, {agencyName}
        </p>
        <p className="mt-5 max-w-2xl mx-auto text-zinc-400 leading-relaxed">
          {intro}
        </p>
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-violet-300 transition-colors"
          >
            Book a Free Strategy Call ↗
          </a>
          <a
            href={`mailto:${email}`}
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/15 glass font-semibold hover:bg-white/10"
          >
            Send Us an Email
          </a>
          {portfolioUrl && (
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-violet-400/40 bg-violet-500/10 font-semibold text-violet-100 hover:bg-violet-500/20 transition-colors"
            >
              View My Portfolio ↗
            </a>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-14">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-violet-300 font-bold">How it works</p>
          <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight">
            From Call to <span className="text-gradient">Done</span>
          </h2>
        </div>
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {flow.map((st, i) => (
            <Reveal key={st.n} delay={i * 90}>
              <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-6 overflow-hidden h-full">
                <span className="text-5xl font-black text-white/[0.07] absolute -top-1 right-3">{st.n}</span>
                <p className="text-xs font-black tracking-widest text-violet-300">{st.n}</p>
                <h3 className="mt-2 font-bold">{st.title}</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{st.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link href="/#book" className="text-sm text-violet-300 underline hover:text-white">
            Ready? Book your free strategy call →
          </Link>
        </p>
      </div>

      <Footer
        agencyName={agencyName}
        calendlyUrl={calendlyUrl}
        footerText={setting(s, "footer_text", "") || undefined}
        logoUrl={logoUrl}
        hideSamples={hideSamples}
      />
    </main>
  );
}
