import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import BookingSection from "@/components/BookingSection";
import { FaqAccordion, Footer } from "@/components/Sections";
import SectionHead from "@/components/SectionHead";
import { HeroSample, SmallCard, WorkGallery } from "@/components/ServiceProofSection";
import { getSiteContent, setting, getAgencyName, samplesHidden } from "@/lib/content";
import { parseGallery } from "@/lib/gallery";
import { SITE, applyAgencyName } from "@/lib/site";
import { FALLBACK_SERVICES } from "@/lib/fallback-data";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return FALLBACK_SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { services, details, settings } = await getSiteContent();
  const service = services.find((s) => s.slug === slug);
  const content = details[slug];
  if (!service || !content) return {};
  const agencyName = getAgencyName(settings);
  const rawTitle = content.metaTitle || `${content.h1} | ${SITE.agencyName}`;
  const title = applyAgencyName(rawTitle, agencyName);
  const description = applyAgencyName(content.metaDesc, agencyName);
  return {
    title,
    description,
    alternates: { canonical: `${SITE.url}/services/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE.url}/services/${slug}`,
      type: "article",
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { settings: s, services, portfolio, details } = await getSiteContent();
  const service = services.find((x) => x.slug === slug);
  const content = details[slug];
  if (!service || !content) notFound();

  const calendlyUrl = setting(s, "calendly_url", SITE.calendlyUrl);
  const agencyName = setting(s, "agency_name", SITE.agencyName);
  const email = setting(s, "contact_email", SITE.contactEmail);
  const logoUrl = s.logo_url?.trim() || SITE.logo;
  const hideSamples = samplesHidden(s);

  const samples = portfolio.filter((p) => p.service_slug === slug);
  const hero = samples.find((p) => p.is_featured) ?? samples[0];
  const rest = hero ? samples.filter((p) => p !== hero) : [];
  const url = `${SITE.url}/services/${slug}`;

  const serviceJson = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: content.h1,
    description: content.intro,
    url,
    provider: {
      "@type": "ProfessionalService",
      name: agencyName,
      url: SITE.url,
      email,
    },
  };

  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE.url}/#services` },
      { "@type": "ListItem", position: 3, name: content.h1, item: url },
    ],
  };

  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main
      className="text-zinc-100 min-h-screen"
      style={{ background: "var(--color-bg, #060606)" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJson) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }}
      />
      <Navbar calendlyUrl={calendlyUrl} agencyName={agencyName} logoUrl={logoUrl} hideSamples={hideSamples} />

      <div className="max-w-6xl mx-auto px-5 pt-32">
        <nav aria-label="Breadcrumb" className="text-xs text-zinc-500">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/#services" className="hover:text-white">Services</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-300">{content.h1}</span>
        </nav>

        <div className="mt-6 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-violet-300 font-bold">
              {agencyName} Services
            </p>
            <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.08]">
              {content.h1}
            </h1>
            <p className="mt-5 text-zinc-400 leading-relaxed">{content.intro}</p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="px-7 py-3.5 rounded-full bg-white text-black text-sm font-bold hover:bg-violet-300 text-center"
              >
                Book a Free Strategy Call ↗
              </a>
              <a
                href={`mailto:${email}`}
                className="px-7 py-3.5 rounded-full border border-white/15 text-sm font-semibold hover:bg-white/10 text-center"
              >
                Send Us an Email
              </a>
            </div>
          </div>
          <div className="glass rounded-3xl p-6">
            <h2 className="font-extrabold text-lg">Why {content.h1.toLowerCase()} with us</h2>
            <ul className="mt-4 space-y-3">
              {content.benefits.map((b) => (
                <li key={b} className="flex gap-3 text-sm text-zinc-300 leading-relaxed">
                  <span className="text-emerald-300 font-bold">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-6">
          <div className="glass rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-extrabold">What&apos;s included</h2>
            <ul className="mt-4 space-y-2.5">
              {content.deliverables.map((d) => (
                <li key={d} className="flex gap-3 text-sm text-zinc-300">
                  <span className="text-violet-300 font-bold">•</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-extrabold">Who it&apos;s for</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {content.idealFor.map((t) => (
                <span key={t} className="text-sm px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm text-zinc-400 leading-relaxed">
              Not sure if this fits? Bring it to a free strategy call — we will tell you honestly which service or combination helps most.
            </p>
          </div>
        </div>

        {!hideSamples && samples.length > 0 && hero && (
          <div className="mt-14 glass glow-border rounded-[2rem] p-6 sm:p-10">
            <HeroSample item={hero} service={service} />
            <div className="mt-10">
              <SectionHead
                eyebrow="Work Samples"
                title={<>Our <span className="text-gradient">Sample Work</span></>}
                sub="Click any sample to view it larger."
              />
            </div>
            {rest.length > 0 && (
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                {rest.map((item) => (
                  <SmallCard key={item.id} item={item} service={service} />
                ))}
              </div>
            )}
            <WorkGallery service={service} gallery={parseGallery(s[`gallery:${slug}`], slug)} hideHeader />
          </div>
        )}

        {content.faqs.length > 0 && (
          <div className="mt-14 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center">
              Frequently asked <span className="text-gradient">questions</span>
            </h2>
            <div className="mt-6">
              <FaqAccordion items={content.faqs.map((f, i) => ({ id: `${i}-${f.q}`, question: f.q, answer: f.a }))} />
            </div>
          </div>
        )}

        <div className="mt-14">
          <h2 className="text-xl font-extrabold text-center">Explore related services</h2>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {services.filter((x) => x.slug !== slug).map((x) => (
              <Link
                key={x.slug}
                href={`/services/${x.slug}`}
                className="text-sm px-4 py-2 rounded-full border border-white/15 hover:bg-white/10"
              >
                {x.icon_emoji} {x.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <BookingSection
        calendlyUrl={calendlyUrl}
        email={email}
        title={setting(s, "sec_booking_title", "Ready to Build, Market, and Grow?")}
        highlight={setting(s, "sec_booking_highlight", "Market, and Grow?")}
        sub={setting(s, "sec_booking_sub", "") || undefined}
        services={services}
        agencyName={agencyName}
      />
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
