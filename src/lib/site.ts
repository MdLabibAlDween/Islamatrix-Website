export const DEFAULT_AGENCY_NAME = "Islamatrix";

/**
 * Quick-brand helper: replaces every whole-word "Islamatrix" (and legacy
 * "Lagency") in `text` with the custom agency name from Admin → Quick Brand
 * (site_settings.agency_name).
 * - Returns `text` unchanged when the name is empty or still "Islamatrix".
 * - Uses \b so "Islamatrix's" correctly becomes "<Name>'s".
 */
export function applyAgencyName(
  text: string,
  agencyName?: string | null
): string {
  const name = (agencyName ?? "").trim();
  // Default brand: still migrate legacy "Lagency" text to "Islamatrix".
  if (!text || !name || name === DEFAULT_AGENCY_NAME)
    return text ? text.replace(/\bLagency\b/g, DEFAULT_AGENCY_NAME) : text;
  return text
    .replace(/\bIslamatrix\b/g, name)
    .replace(/\bLagency\b/g, name);
}

export const SITE: {
  agencyName: string;
  url: string;
  contactEmail: string;
  calendlyUrl: string;
  logo: string;
  favicon: string;
  eyebrow: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroCreativeLine: string;
  heroSubtitle: string;
  heroTrustLine: string;
} = {
  agencyName:
    (process.env.NEXT_PUBLIC_AGENCY_NAME ?? "").trim() || "Islamatrix",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim() || "https://labibaldween.com",
  contactEmail:
    (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? process.env.CONTACT_EMAIL ?? "").trim() ||
    "labib@labibaldween.com",
  calendlyUrl:
    (process.env.NEXT_PUBLIC_CALENDLY_URL ?? "").trim() ||
    "https://calendly.com/mdlabibaldween/30min",
  // Default brand assets in /public — used when Admin → logo_url / favicon_url is empty.
  logo: "/logo.png",
  favicon: "/Favicon.png",
  // Hero (SEO: H1 states the offer, creative line kept as secondary)
  eyebrow: "Halal Business Solutions for Muslim Businessmen — strictly according to Shariah",
  heroTitle: "One Halal Digital Growth Agency for Muslim Businesses",
  heroTitleHighlight: "Halal Digital Growth Agency",
  heroCreativeLine: "Let's Bring Life To Your Business",
  heroSubtitle:
    "Islamatrix offers Halal business solutions exclusively for Muslim businessmen. We only work with Muslim customers because every service is delivered strictly according to Shariah — every work managed for you, all in one place.",
  heroTrustLine:
    "Talk with a manager, explain your goals, and get a practical Halal plan for your next stage of growth.",
};
