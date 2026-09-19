export type Service = {
  id: string;
  slug: string;
  title: string;
  short_desc: string;
  long_desc: string;
  icon_emoji: string;
  accent_color: string;
  order_index: number;
  is_active: boolean;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  service_slug: string | null;
  photo_url: string;
  bio: string;
  specialties: string[];
  email: string;
  whatsapp: string;
  portfolio_url: string;
  order_index: number;
  is_active: boolean;
  is_founder: boolean;
};

export type PortfolioItem = {
  id: string;
  service_slug: string | null;
  title: string;
  description: string;
  client_name: string;
  image_url: string;
  embed_url: string;
  embed_type: string; // youtube | image | website | behance | drive | other
  proof_metric: string;
  is_featured: boolean;
  order_index: number;
  is_active: boolean;
};

export type Testimonial = {
  id: string;
  client_name: string;
  client_role: string;
  client_avatar_url: string;
  quote: string;
  rating: number;
  service_slug: string | null;
  order_index: number;
  is_active: boolean;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  order_index: number;
  is_active: boolean;
};

/** One slot in a service's "Work samples" gallery (3 per service). */
export type WorkSample = {
  title: string;
  url: string;
  kind: "video" | "image" | "pdf";
};

export type GalleryKind = WorkSample["kind"];

// NOTE: the client area / booking-request inbox was removed permanently.
// Contact is via Calendly + email only — do not reintroduce BookingRequest.
