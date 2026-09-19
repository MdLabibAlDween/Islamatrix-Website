import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero, { ServicesGrid } from "@/components/Hero";
import ServiceProofSection from "@/components/ServiceProofSection";
import TeamGrid from "@/components/TeamGrid";
import SectionHead from "@/components/SectionHead";
import GradientTitle from "@/components/Title";
import { Process } from "@/components/Showcase";
import { FaqSection, Footer, Testimonials } from "@/components/Sections";
import BookingSection from "@/components/BookingSection";
import PricingSection from "@/components/Pricing";
import { getSiteContent, parseStats, parseSteps, setting, samplesHidden } from "@/lib/content";
import { parseGallery, galleryKey } from "@/lib/gallery";
import { SITE } from "@/lib/site";

// Live content from Supabase (admin-editable), hardcoded fallbacks when offline.
// To change copy without the admin panel, edit src/lib/site.ts and src/lib/fallback-data.ts.

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: SITE.url },
};

export default async function Home() {
  const { settings: s, services, portfolio, testimonials, faqs } =
    await getSiteContent();

  const calendlyUrl = setting(s, "calendly_url", SITE.calendlyUrl);
  const agencyName = setting(s, "agency_name", SITE.agencyName);
  const email = setting(s, "contact_email", SITE.contactEmail);
  const logoUrl = s.logo_url?.trim() || SITE.logo;
  // No-samples mode (Admin → Site → Work samples visibility): hide every
  // portfolio section + Samples menu. Default off = samples visible.
  const hideSamples = samplesHidden(s);

  const byService = (slug: string) =>
    portfolio.filter((p) => p.service_slug === slug);

  const orgJson = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: agencyName,
    url: SITE.url,
    email,
    description:
      "Islamatrix offers Halal business solutions exclusively for Muslim businessmen — video editing, web development, lead generation, automation, marketing, design, SEO, and copywriting, all strictly according to Shariah, every work managed for you, all in one place.",
  };

  const websiteJson = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: agencyName,
    url: SITE.url,
  };

  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <main
      className="text-zinc-100 min-h-screen"
      style={{ background: "var(--color-bg, #060606)" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJson) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJson) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }}
      />
      <Navbar calendlyUrl={calendlyUrl} agencyName={agencyName} logoUrl={logoUrl} hideSamples={hideSamples} />
      <Hero
        calendlyUrl={calendlyUrl}
        eyebrow={setting(s, "hero_eyebrow", SITE.eyebrow)}
        title={setting(s, "hero_title", SITE.heroTitle)}
        highlight={setting(s, "hero_highlight", SITE.heroTitleHighlight)}
        creativeLine={setting(s, "hero_creative", SITE.heroCreativeLine)}
        trustLine={setting(s, "hero_trust", SITE.heroTrustLine)}
        stats={parseStats(s.stats_config)}
      />
      <ServicesGrid
        services={services}
        eyebrow={setting(s, "sec_services_eyebrow", "Our Digital Business Services")}
        title={setting(s, "sec_services_title", "Everything Your Business Needs to Grow Online")}
        highlight={setting(s, "sec_services_highlight", "Grow Online")}
        sub={setting(s, "sec_services_sub", "From content production to lead generation, Islamatrix brings Halal skills, strategy, and execution for Muslim businesses under one roof — strictly according to Shariah.")}
        agencyName={agencyName}
      />
      <PricingSection
        services={services}
        eyebrow={setting(s, "sec_pricing_eyebrow", "Pricing")}
        title={setting(s, "sec_pricing_title", "Honest estimate pricing.")}
        highlight={setting(s, "sec_pricing_highlight", "estimate pricing.")}
        sub={setting(s, "sec_pricing_sub", "Estimates only — the exact fee is decided together on your strategy call before any work begins.")}
      />
      {!hideSamples && (
      <div id="work" className="scroll-mt-20">
        <div className="max-w-6xl mx-auto px-5 pt-6">
          <SectionHead
            eyebrow={setting(s, "sec_work_eyebrow", "Work Samples")}
            title={
              <GradientTitle
                title={setting(s, "sec_work_title", "See Our Work Samples")}
                highlight={setting(s, "sec_work_highlight", "Work Samples")}
              />
            }
            sub={setting(s, "sec_work_sub", "Explore selected examples of video editing, websites, automation systems, marketing campaigns, design work, SEO deliverables, and copywriting projects.")}
          />
        </div>
        {services.map((svc, i) => (
          <ServiceProofSection
            key={svc.slug}
            service={svc}
            items={byService(svc.slug)}
            gallery={parseGallery(s[galleryKey(svc.slug)], svc.slug)}
            calendlyUrl={calendlyUrl}
            flip={i % 2 === 1}
            agencyName={agencyName}
          />
        ))}
      </div>
      )}
      <Process
        label={setting(s, "sec_process_label", "How it works")}
        title={setting(s, "sec_process_title", "From First Call to Final Delivery")}
        highlight={setting(s, "sec_process_highlight", "Final Delivery")}
        sub={setting(s, "sec_process_sub", "A simple process keeps your project organized, transparent, and focused on business outcomes.")}
        steps={parseSteps(s.process_config)}
      />
      <TeamGrid
        eyebrow={setting(s, "sec_team_eyebrow", "How we work")}
        title={setting(s, "sec_team_title", "Every Work Managed for You, All in One Place.")}
        highlight={setting(s, "sec_team_highlight", "All in One Place.")}
        sub={setting(s, "sec_team_sub", "You share your goal once — our agency plans, executes, and delivers everything for you, with a single point of contact from start to finish.")}
        cardTitle={setting(s, "sec_team_card_title", "") || undefined}
        cardText={setting(s, "sec_team_card_text", "") || undefined}
        tagline={setting(s, "sec_team_tagline", "From Assigning Experts to Delivering Quality Content to You, Our Agency Will Manage Everything for You.")}
      />
      <Testimonials
        items={testimonials}
        eyebrow={setting(s, "sec_testimonials_eyebrow", "What clients say")}
        title={setting(s, "sec_testimonials_title", "What our clients say.")}
        highlight={setting(s, "sec_testimonials_highlight", "clients say.")}
      />
      <FaqSection
        faqs={faqs}
        eyebrow={setting(s, "sec_faq_eyebrow", "Good to know")}
        title={setting(s, "sec_faq_title", "Frequently asked questions.")}
        highlight={setting(s, "sec_faq_highlight", "questions.")}
      />
      <BookingSection
        calendlyUrl={calendlyUrl}
        email={email}
        title={setting(s, "sec_booking_title", "Ready to Grow Your Halal Business?")}
        highlight={setting(s, "sec_booking_highlight", "Halal Business?")}
        sub={setting(s, "sec_booking_sub", "Islamatrix offers Halal business solutions exclusively for Muslim businessmen — tell us what your business needs and we will create a clear, Shariah-compliant plan for you.")}
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
