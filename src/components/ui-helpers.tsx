import type { Service } from "@/lib/types";

export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const m =
    url.match(/(?:youtube\.com\/(?:embed\/|watch\?v=|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/) ||
    url.match(/vi\/([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}

export function getDriveId(url: string): string | null {
  if (!url || !url.includes("drive.google")) return null;
  const m = url.match(/\/d\/([A-Za-z0-9_-]{10,})/) || url.match(/[?&]id=([A-Za-z0-9_-]{10,})/);
  return m ? m[1] : null;
}

export function isVideoFile(url: string): boolean {
  if (!url) return false;
  const clean = url.split("?")[0].split("#")[0].toLowerCase();
  return (
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".mov") ||
    clean.endsWith(".m4v")
  );
}

export function looksLikeImage(url: string): boolean {
  if (!url || url.startsWith("data:image")) return !!url;
  const clean = url.split("?")[0].split("#")[0].toLowerCase();
  return (
    clean.endsWith(".jpg") ||
    clean.endsWith(".jpeg") ||
    clean.endsWith(".png") ||
    clean.endsWith(".webp") ||
    clean.endsWith(".gif") ||
    clean.endsWith(".avif")
  );
}

/** Returns the best full-size visual URL for cards (youtube thumb > image). */
export function thumbFor(imageUrl: string, embedUrl: string): string {
  const yt = getYouTubeId(embedUrl || imageUrl);
  if (yt) return `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`;
  return imageUrl;
}

export function YouTubeEmbed({ url, title }: { url: string; title: string }) {
  const id = getYouTubeId(url);
  if (!id) return null;
  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
        loading="lazy"
      />
    </div>
  );
}

export function VideoFileEmbed({ url, title }: { url: string; title: string }) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
      <video src={url} title={title} controls preload="metadata" playsInline className="h-full w-full">
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export function DriveEmbed({ url, title }: { url: string; title: string }) {
  const id = getDriveId(url);
  if (!id) return null;
  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
      <iframe
        src={`https://drive.google.com/file/d/${id}/preview`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
        loading="lazy"
      />
    </div>
  );
}

export function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function ServiceBadge({ service }: { service?: Service }) {
  if (!service) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5"
      style={{ boxShadow: `0 0 24px -8px ${service.accent_color}` }}
    >
      <span>{service.icon_emoji}</span> {service.title}
    </span>
  );
}
