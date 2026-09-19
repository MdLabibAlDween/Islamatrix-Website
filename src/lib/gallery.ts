import type { GalleryKind, WorkSample } from "./types";

/** Gallery slot key helper (hardcoded site — galleries render empty until filled in code). */
export function galleryKey(slug: string) {
  return `gallery:${slug}`;
}

/** Default sample type per service: videos for video, photos for design, PDFs elsewhere. */
export function defaultKindFor(slug: string): GalleryKind {
  if (slug === "video-editing") return "video";
  if (slug === "ui-ux-graphic-design") return "image";
  return "pdf";
}

export const GALLERY_SLOTS = 3;

/** Parse a stored gallery JSON value into exactly 3 slots (empty slots = placeholders). */
export function parseGallery(raw: string | undefined, slug: string): WorkSample[] {
  const fallback = defaultKindFor(slug);
  let arr: unknown[] = [];
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) arr = parsed;
    } catch {
      arr = [];
    }
  }
  const slots: WorkSample[] = [];
  for (let i = 0; i < GALLERY_SLOTS; i++) {
    const s = (arr[i] ?? {}) as Partial<WorkSample>;
    slots.push({
      title: typeof s.title === "string" ? s.title : "",
      url: typeof s.url === "string" ? s.url : "",
      kind: s.kind === "video" || s.kind === "image" || s.kind === "pdf" ? s.kind : fallback,
    });
  }
  return slots;
}

export function filledCount(gallery: WorkSample[]): number {
  return gallery.filter((g) => g.url.trim() !== "").length;
}
