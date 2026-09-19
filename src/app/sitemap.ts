import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/content";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  let slugs: string[] = [];
  try {
    const { services } = await getSiteContent();
    slugs = services.map((s) => s.slug);
  } catch {
    slugs = [];
  }
  return [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...slugs.map((slug) => ({
      url: `${SITE.url}/services/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE.url}/privacy`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE.url}/terms`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
  ];
}
