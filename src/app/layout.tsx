import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BackToTop from "@/components/BackToTop";
import CustomCursor from "@/components/CustomCursor";
import { THEME_DEFAULTS, themeCssVars } from "@/lib/theme";
import { SITE, applyAgencyName } from "@/lib/site";
import { getSiteContent, getAgencyName, setting } from "@/lib/content";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_TITLE = "Islamatrix | Halal Business Solutions for Muslim Businessmen";
const BASE_DESC =
  "Islamatrix offers Halal business solutions exclusively for Muslim businessmen — video editing, web development, lead generation, automation, marketing, SEO, design and copywriting, all strictly according to Shariah.";
const BASE_KEYWORDS = [
  "halal business solutions",
  "halal digital agency for muslim businessmen",
  "muslim business services",
  "shariah compliant business services",
  "islamic shariah video editing",
  "web design and development",
  "lead generation and CRM services for small business",
  "business process automation",
  "social media management",
  "Meta Ads management",
  "local SEO services",
  "website copywriting",
  "email marketing",
];

export async function generateMetadata(): Promise<Metadata> {
  let agencyName = SITE.agencyName;
  let settings: Record<string, string> = {};
  try {
    const content = await getSiteContent();
    agencyName = getAgencyName(content.settings);
    settings = content.settings;
  } catch {
    agencyName = SITE.agencyName;
  }
  const title = applyAgencyName(setting(settings, "meta_title", BASE_TITLE), agencyName);
  const description = applyAgencyName(setting(settings, "meta_description", BASE_DESC), agencyName);
  const keywordsRaw = setting(settings, "meta_keywords", "").trim();
  const keywords = keywordsRaw
    ? keywordsRaw.split(",").map((k) => k.trim()).filter(Boolean)
    : BASE_KEYWORDS;
  const faviconUrl = (settings.favicon_url || "").trim() || SITE.favicon;
  return {
    metadataBase: new URL(SITE.url),
    title,
    description,
    keywords,
    icons: { icon: [{ url: faviconUrl }], apple: [{ url: faviconUrl }] },
    alternates: { canonical: SITE.url },
    openGraph: {
      type: "website",
      url: SITE.url,
      siteName: agencyName,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// Hardcoded theme — no database. Edit THEME_DEFAULTS in src/lib/theme.ts.
const vars = themeCssVars(THEME_DEFAULTS);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        {vars && (
          <style
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: `:root{${vars}}` }}
          />
        )}
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#060606] text-zinc-100"
      >
        {children}
        {/* Spacer so the sticky mobile CTA never covers footer content */}
        <div className="h-20 md:hidden" aria-hidden="true" />
        {/* Sticky booking CTA on mobile */}
        <a
          href={SITE.calendlyUrl}
          target="_blank"
          rel="noreferrer"
          className="md:hidden fixed bottom-4 inset-x-4 z-40 rounded-full bg-white text-black text-center text-sm font-bold py-3.5 shadow-2xl"
        >
          Book a Free Strategy Call ↗
        </a>
        <BackToTop />
        <CustomCursor />
      </body>
    </html>
  );
}
