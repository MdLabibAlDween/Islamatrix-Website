import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Sections";
import LegalBody from "@/components/LegalBody";
import { SITE, applyAgencyName } from "@/lib/site";
import { getSiteContent, getAgencyName, setting, samplesHidden } from "@/lib/content";
import { FALLBACK_PRIVACY_BODY, FALLBACK_PRIVACY_UPDATED } from "@/lib/fallback-data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  let agencyName = SITE.agencyName;
  try {
    const { settings } = await getSiteContent();
    agencyName = getAgencyName(settings);
  } catch {
    agencyName = SITE.agencyName;
  }
  return {
    title: applyAgencyName("Privacy Policy | Islamatrix", agencyName),
    description: applyAgencyName(
      "How Islamatrix handles your information when you visit our website, use the contact form, book a call, or email us.",
      agencyName
    ),
    alternates: { canonical: `${SITE.url}/privacy` },
  };
}

export default async function PrivacyPage() {
  let agencyName = SITE.agencyName;
  let calendlyUrl = SITE.calendlyUrl;
  let contactEmail = SITE.contactEmail;
  let logoUrl: string | undefined = SITE.logo;
  let hideSamples = false;
  let body = FALLBACK_PRIVACY_BODY;
  let updated = FALLBACK_PRIVACY_UPDATED;
  try {
    const { settings } = await getSiteContent();
    agencyName = getAgencyName(settings);
    calendlyUrl = settings.calendly_url || calendlyUrl;
    contactEmail = settings.contact_email || contactEmail;
    logoUrl = settings.logo_url?.trim() || SITE.logo;
    hideSamples = samplesHidden(settings);
    body = setting(settings, "privacy_body", FALLBACK_PRIVACY_BODY);
    updated = setting(settings, "privacy_updated", FALLBACK_PRIVACY_UPDATED);
  } catch {
    /* fall back to hardcoded defaults */
  }
  return (
    <main
      className="text-zinc-100 min-h-screen"
      style={{ background: "var(--color-bg, #060606)" }}
    >
      <Navbar calendlyUrl={calendlyUrl} agencyName={agencyName} logoUrl={logoUrl} hideSamples={hideSamples} />
      <div className="max-w-3xl mx-auto px-5 pt-32 pb-20">
        <p className="text-xs uppercase tracking-[0.2em] text-violet-300 font-bold">
          Legal
        </p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: {updated}</p>

        <LegalBody body={body} email={contactEmail} />

        <p className="mt-8">
          <Link href="/" className="text-violet-300 underline">← Back to home</Link>
        </p>
      </div>
      <Footer agencyName={agencyName} calendlyUrl={calendlyUrl} logoUrl={logoUrl} hideSamples={hideSamples} />
    </main>
  );
}
