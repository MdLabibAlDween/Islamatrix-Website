"use client";
import { useCallback, useEffect, useState } from "react";
import type { GalleryKind, PortfolioItem, Service, WorkSample } from "@/lib/types";
import Reveal from "./Reveal";
import {
  DriveEmbed,
  VideoFileEmbed,
  YouTubeEmbed,
  getDriveId,
  getYouTubeId,
  isVideoFile,
  looksLikeImage,
  thumbFor,
} from "./ui-helpers";

const KIND_META: Record<GalleryKind, { icon: string; label: string }> = {
  video: { icon: "▶", label: "Video" },
  image: { icon: "🖼", label: "Photo" },
  pdf: { icon: "📄", label: "PDF" },
};

export default function ServiceProofSection({
  service,
  items,
  gallery,
  calendlyUrl,
  flip,
  agencyName,
}: {
  service: Service;
  items: PortfolioItem[];
  gallery: WorkSample[];
  calendlyUrl: string;
  flip?: boolean;
  agencyName?: string;
}) {
  const hero = items.find((i) => i.is_featured) ?? items[0];
  const rest = items.filter((i) => i !== hero).slice(0, 4);
  const handledBy = agencyName?.trim() || "Islamatrix";

  return (
    <section id={`work-${service.slug}`} className="px-5 py-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto glass glow-border rounded-[2rem] p-6 sm:p-10 overflow-hidden relative">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[100px] opacity-30" style={{ background: service.accent_color }} />
        <div className={`relative grid lg:grid-cols-[1fr_1.4fr] gap-8 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
          <div>
            <span className="text-4xl">{service.icon_emoji}</span>
            <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold">{service.title}</h3>
            <p className="mt-3 text-zinc-400 text-sm sm:text-base leading-relaxed">{service.long_desc || service.short_desc}</p>

            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/10 bg-black/40 p-4">
              <div className="w-16 h-16 shrink-0 rounded-2xl grid place-items-center text-3xl bg-white/5 border border-white/10">
                {service.icon_emoji}
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-widest text-zinc-500">Handled by</p>
                <p className="font-bold truncate">{handledBy}, end-to-end</p>
                <p className="text-sm text-violet-200 truncate">Planned, executed & delivered in one place</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <a href={calendlyUrl} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-violet-300">Discuss this service ↗</a>
              <a href="#team" className="px-5 py-2.5 rounded-full border border-white/15 text-sm font-semibold hover:bg-white/10">How we work</a>
            </div>
          </div>

          <div>
            {!hero ? (
              <div className="h-full min-h-[280px] grid place-items-center rounded-2xl border border-dashed border-white/15 text-zinc-500 text-sm p-8 text-center">
                Work Samples coming soon.
              </div>
            ) : (
              <>
                {/* BIG FEATURED BLOCK — same for every service */}
                <Reveal><HeroSample item={hero} service={service} /></Reveal>
                {rest.length > 0 && (
                  <div className="mt-4 grid sm:grid-cols-2 gap-4">
                    {rest.map((item, i) => (
                      <Reveal key={item.id} delay={i * 90}><SmallCard item={item} service={service} /></Reveal>
                    ))}
                  </div>
                )}
                {items.length > 5 && <p className="mt-3 text-xs text-zinc-500">+{items.length - 5} more available — ask about them on your free call.</p>}
              </>
            )}
          </div>
        </div>

        {/* WORK SAMPLES GALLERY — 3 slots, click for large view */}
        <WorkGallery service={service} gallery={gallery} />
      </div>
    </section>
  );
}

/* ================= hero + cards (unchanged behavior, cleaned copy) ================= */

/** The big showcase block — renders the best available visual for ANY sample type. */
export function HeroSample({ item, service }: { item: PortfolioItem; service: Service }) {
  const [open, setOpen] = useState(false);
  const yt = getYouTubeId(item.embed_url);
  const drive = !yt && getDriveId(item.embed_url);
  const videoFile = !yt && !drive && (item.embed_type === "video" || isVideoFile(item.embed_url));
  const website = !yt && !drive && !videoFile && (item.embed_type === "website" || (!item.image_url && !item.embed_url));
  const image = !yt && !drive && !videoFile && !website && (item.image_url || item.embed_url);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/60">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View ${item.title} larger`}
        title="View larger"
        className="absolute left-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/70 text-sm font-black text-white backdrop-blur transition hover:scale-110 hover:bg-white hover:text-black active:scale-95"
      >
        ⤢
      </button>
      {open && <PortfolioLightbox item={item} serviceTitle={service.title} onClose={() => setOpen(false)} />}
      {yt ? (
        <YouTubeEmbed url={item.embed_url} title={item.title} />
      ) : drive ? (
        <DriveEmbed url={item.embed_url} title={item.title} />
      ) : videoFile ? (
        <VideoFileEmbed url={item.embed_url} title={item.title} />
      ) : website ? (
        <a
          href={item.embed_url || undefined}
          target={item.embed_url ? "_blank" : undefined}
          rel="noreferrer"
          className="block relative min-h-[240px] sm:min-h-[300px] group"
          style={{ background: `linear-gradient(135deg, ${service.accent_color}33, #000 70%)` }}
        >
          {item.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image_url} alt={item.title} className="absolute inset-0 h-full w-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" loading="lazy" />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <span className="text-7xl opacity-40">{service.icon_emoji}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          {item.embed_url && (
            <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-widest text-zinc-400">Live website</p>
                <p className="font-bold truncate max-w-[320px]">{item.embed_url}</p>
              </div>
              <span className="shrink-0 px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold group-hover:bg-violet-300">Open site ↗</span>
            </div>
          )}
        </a>
      ) : image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumbFor(item.image_url, item.embed_url)} alt={item.title} className="aspect-video w-full object-cover" loading="lazy" />
      ) : (
        <div
          className="aspect-video w-full grid place-items-center relative overflow-hidden"
          style={{ background: `radial-gradient(ellipse at 50% 120%, ${service.accent_color}55, #000 70%)` }}
        >
          <div className="text-center px-6">
            <div className="text-6xl">{service.icon_emoji}</div>
            <p className="mt-3 font-bold text-lg">{item.title}</p>
            <p className="mt-1 text-xs text-zinc-400">Recent work available — book a call to see it.</p>
          </div>
          {item.proof_metric && (
            <span className="absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-400/15 text-emerald-300 border border-emerald-400/30">{item.proof_metric}</span>
          )}
        </div>
      )}
      <div className="p-4 sm:p-5">
        <ProofMeta item={item} big />
      </div>
    </div>
  );
}

export function SmallCard({ item, service }: { item: PortfolioItem; service: Service }) {
  const [open, setOpen] = useState(false);
  const visual = thumbFor(item.image_url, item.embed_url);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View ${item.title} larger`}
        title="View larger"
        className="card-hover card-sheen group block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 bg-black/50 text-left"
      >
        {visual ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={visual} alt={item.title} className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div
            className="aspect-video grid place-items-center text-4xl"
            style={{ background: `linear-gradient(135deg, ${service.accent_color}44, #000)` }}
          >
            {service.icon_emoji}
          </div>
        )}
        <ProofMeta item={item} />
      </button>
      {open && <PortfolioLightbox item={item} serviceTitle={service.title} onClose={() => setOpen(false)} />}
    </>
  );
}

function ProofMeta({ item, big }: { item: PortfolioItem; big?: boolean }) {
  return (
    <div className={big ? "" : "p-4"}>
      <div className="flex items-center justify-between gap-2">
        <h4 className={`font-bold leading-snug ${big ? "text-base sm:text-lg" : "text-sm sm:text-base"}`}>{item.title}</h4>
        {item.proof_metric && (
          <span className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-400/15 text-emerald-300 border border-emerald-400/30">{item.proof_metric}</span>
        )}
      </div>
      {item.client_name && <p className="mt-1 text-xs text-zinc-500">{item.client_name}</p>}
      {item.description && <p className={`mt-2 text-zinc-400 leading-relaxed ${big ? "text-sm" : "text-xs line-clamp-2"}`}>{item.description}</p>}
    </div>
  );
}

/* ================= portfolio lightbox (large popup for any sample) ================= */

function PortfolioLightbox({ item, serviceTitle, onClose }: {
  item: PortfolioItem;
  serviceTitle: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const yt = getYouTubeId(item.embed_url);
  const drive = !yt && getDriveId(item.embed_url);
  const videoFile = !yt && !drive && (item.embed_type === "video" || isVideoFile(item.embed_url));
  const website = !yt && !drive && !videoFile && (item.embed_type === "website" || (!item.image_url && !item.embed_url));
  const image = !yt && !drive && !videoFile && !website && (item.image_url || item.embed_url);
  const original = item.embed_url || item.image_url;
  const kindLabel = yt || videoFile ? "Video" : drive ? "File" : website ? "Website" : image ? "Image" : "Sample";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${item.title} large view`}>
      <div className="pop-in max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/15 bg-[#0b0b0b]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-widest text-zinc-500">{serviceTitle} · {kindLabel}</p>
            <p className="truncate text-sm sm:text-base font-bold">{item.title}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white font-bold text-black" aria-label="Close">✕</button>
        </div>

        <div className="p-4 sm:p-5">
          {yt ? (
            <YouTubeEmbed url={item.embed_url} title={item.title} />
          ) : drive ? (
            <DriveEmbed url={item.embed_url} title={item.title} />
          ) : videoFile ? (
            <VideoFileEmbed url={item.embed_url} title={item.title} />
          ) : website ? (
            original ? (
              <iframe src={original} title={item.title} className="h-[70vh] w-full rounded-2xl border border-white/10 bg-white" loading="lazy" />
            ) : (
              <p className="py-10 text-center text-sm text-zinc-500">Website preview unavailable.</p>
            )
          ) : image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbFor(item.image_url, item.embed_url)} alt={item.title} className="mx-auto max-h-[75vh] w-auto max-w-full rounded-2xl border border-white/10 object-contain" />
          ) : (
            <p className="py-10 text-center text-sm text-zinc-500">Preview unavailable — ask about it on your free call.</p>
          )}
        </div>

        {(item.description || item.client_name || item.proof_metric) && (
          <div className="px-5 sm:px-6 pb-2">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-bold leading-snug">{item.title}</h4>
              {item.proof_metric && (
                <span className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-400/15 text-emerald-300 border border-emerald-400/30">{item.proof_metric}</span>
              )}
            </div>
            {item.client_name && <p className="mt-1 text-xs text-zinc-500">{item.client_name}</p>}
            {item.description && <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{item.description}</p>}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4">
          <p className="text-xs text-zinc-500">High-resolution original</p>
          {original ? (
            <a href={original} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold hover:bg-white/10">Open original ↗</a>
          ) : (
            <a href="#book" onClick={onClose} className="rounded-full bg-white px-4 py-2 text-xs font-bold text-black">Ask on a free call</a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= work samples gallery + lightbox ================= */

export function WorkGallery({ service, gallery, hideHeader }: { service: Service; gallery: WorkSample[]; hideHeader?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  const filled = gallery.filter((g) => g.url.trim() !== "");

  const close = useCallback(() => setOpen(null), []);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((v) => (v === null ? v : (v + 1) % gallery.length));
      if (e.key === "ArrowLeft") setOpen((v) => (v === null ? v : (v - 1 + gallery.length) % gallery.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, gallery.length]);

  return (
    <div className={`relative ${hideHeader ? "mt-6" : "mt-8 border-t border-white/10 pt-6"}`}>
      {!hideHeader && (
      <div className="flex items-end justify-between gap-3">
        <div>
          <h4 className="text-lg sm:text-xl font-extrabold">Work Samples</h4>
          <p className="mt-1 text-xs text-zinc-500">Click any sample to view it larger.</p>
        </div>
        {filled.length > 0 && (
          <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-zinc-400">
            {filled.length} of {gallery.length} samples
          </span>
        )}
      </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
        {gallery.map((g, i) => (
          <Reveal key={i} delay={i * 70}><GalleryTile index={i} sample={g} service={service} onOpen={() => g.url.trim() && setOpen(i)} /></Reveal>
        ))}
      </div>

      {open !== null && gallery[open]?.url.trim() && (
        <Lightbox sample={gallery[open]} position={open} total={gallery.length} serviceTitle={service.title} onClose={close} onPrev={() => setOpen((open - 1 + gallery.length) % gallery.length)} onNext={() => setOpen((open + 1) % gallery.length)} />
      )}
    </div>
  );
}

function tileThumb(sample: WorkSample): string | null {
  if (sample.kind === "video") {
    const yt = getYouTubeId(sample.url);
    if (yt) return `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`;
    return null;
  }
  if (sample.kind === "image" && (looksLikeImage(sample.url) || sample.url.startsWith("data:image"))) return sample.url;
  return null;
}

function GalleryTile({ index, sample, service, onOpen }: { index: number; sample: WorkSample; service: Service; onOpen: () => void }) {
  const meta = KIND_META[sample.kind];
  const filled = sample.url.trim() !== "";
  const thumb = filled ? tileThumb(sample) : null;

  const body = (
    <>
      {thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumb} alt={sample.title || `Sample ${index + 1}`} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
      ) : (
        <div className="absolute inset-0 grid place-items-center" style={{ background: `linear-gradient(150deg, ${service.accent_color}30, #0a0a0a 75%)` }}>
          <span className="text-3xl sm:text-4xl opacity-80">{filled ? meta.icon : service.icon_emoji}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      <span className="absolute left-2 top-2 rounded-full border border-white/15 bg-black/60 px-2 py-0.5 text-[10px] font-bold text-zinc-200">{meta.icon} {meta.label}</span>
      <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3">
        <p className="truncate text-xs sm:text-sm font-bold">{sample.title || `Sample ${index + 1}`}</p>
        <p className="text-[10px] sm:text-[11px] text-zinc-400">{filled ? "Click to view larger" : "Coming soon"}</p>
      </div>
      {filled && (
        <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-black text-black opacity-0 transition-opacity group-hover:opacity-100">⤢</span>
      )}
    </>
  );

  const cls = `group card-sheen relative aspect-[4/3] overflow-hidden rounded-2xl border text-left transition-all ${
    filled ? "border-white/10 card-hover cursor-zoom-in" : "border-dashed border-white/15"
  }`;

  return filled ? (
    <button type="button" onClick={onOpen} className={cls} aria-label={`View ${sample.title || `sample ${index + 1}`} larger`}>
      {body}
    </button>
  ) : (
    <div className={cls}>{body}</div>
  );
}

function Lightbox({ sample, position, total, serviceTitle, onClose, onPrev, onNext }: {
  sample: WorkSample;
  position: number;
  total: number;
  serviceTitle: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const meta = KIND_META[sample.kind];
  const yt = sample.kind === "video" ? getYouTubeId(sample.url) : null;
  const drive = !yt ? getDriveId(sample.url) : null;
  const directVideo = sample.kind === "video" && !yt && !drive && (isVideoFile(sample.url) || sample.url.trim() !== "");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${sample.title} large view`}>
      <div className="pop-in w-full max-w-5xl overflow-hidden rounded-3xl border border-white/15 bg-[#0b0b0b]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-widest text-zinc-500">{serviceTitle} · {meta.icon} {meta.label} · {position + 1}/{total}</p>
            <p className="truncate text-sm sm:text-base font-bold">{sample.title || `Sample ${position + 1}`}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {total > 1 && (
              <>
                <button type="button" onClick={onPrev} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 hover:bg-white/10" aria-label="Previous">←</button>
                <button type="button" onClick={onNext} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 hover:bg-white/10" aria-label="Next">→</button>
              </>
            )}
            <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-white font-bold text-black" aria-label="Close">✕</button>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {sample.kind === "video" ? (
            yt ? <YouTubeEmbed url={sample.url} title={sample.title} />
            : drive ? <DriveEmbed url={sample.url} title={sample.title} />
            : directVideo ? <VideoFileEmbed url={sample.url} title={sample.title} />
            : <p className="py-10 text-center text-sm text-zinc-500">Video unavailable.</p>
          ) : sample.kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={sample.url} alt={sample.title} className="mx-auto max-h-[75vh] w-auto max-w-full rounded-2xl border border-white/10 object-contain" />
          ) : drive ? (
            <DriveEmbed url={sample.url} title={sample.title} />
          ) : (
            <iframe src={sample.url} title={sample.title} className="h-[70vh] w-full rounded-2xl border border-white/10 bg-white" loading="lazy" />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-5 py-3.5">
          <p className="text-xs text-zinc-500">High-resolution original</p>
          <div className="flex gap-2">
            <a href={sample.url} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold hover:bg-white/10">Open original ↗</a>
            {sample.kind !== "video" && (
              <a href={sample.url} download className="rounded-full bg-white px-4 py-2 text-xs font-bold text-black">Download</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
