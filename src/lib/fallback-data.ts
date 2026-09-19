import type { Faq, PortfolioItem, Service, TeamMember, Testimonial } from "./types";

export const FALLBACK_SERVICES: Service[] = [
  { id: "s1", slug: "video-editing", title: "Professional Video Editing", short_desc: "Create engaging YouTube videos, short-form content, ads, and talking-head videos with captions, color grading, motion graphics, and Islamic Shariah-compliant editing options.", long_desc: "Documentary, talking-head, ads & shorts editing with captions, b-roll, color grade. 100% Islamic Shariah-compliant workflow: no music, no non-hijab footage used without approval.", icon_emoji: "🎬", accent_color: "#f43f5e", order_index: 1, is_active: true },
  { id: "s2", slug: "lead-generation-crm", title: "Lead Generation & CRM Management", short_desc: "Get a steady flow of qualified leads with funnels, lead ads, and CRM follow-up systems that convert inquiries into customers.", long_desc: "Lead funnels, landing pages, Meta/Google lead ads, CRM pipeline setup, and automated WhatsApp/email follow-up with weekly reporting.", icon_emoji: "🧲", accent_color: "#22d3ee", order_index: 2, is_active: true },
  { id: "s3", slug: "web-design-development", title: "High-Performance Website Design", short_desc: "Launch a fast, modern, SEO-ready website built with technologies such as Next.js and Supabase, with analytics and business tools integrated from the start.", long_desc: "Landing pages, business sites & e-commerce. Next.js builds, SEO-ready, analytics, WhatsApp/Calendly integrated.", icon_emoji: "💻", accent_color: "#a78bfa", order_index: 3, is_active: true },
  { id: "s4", slug: "business-automation", title: "Business Process Automation", short_desc: "Reduce repetitive work with CRM systems, lead capture, WhatsApp follow-ups, email automation, invoicing workflows, and Zapier or n8n integrations.", long_desc: "Lead capture → CRM → WhatsApp/email follow-up, invoicing, n8n/Zapier automations with Loom walkthroughs.", icon_emoji: "⚙️", accent_color: "#fbbf24", order_index: 4, is_active: true },
  { id: "s5", slug: "social-media-management", title: "Social Media Management", short_desc: "Plan, create, publish, and measure consistent social media content with content calendars, reels, captions, community support, and monthly reporting.", long_desc: "30-day calendars, reels/shorts repurposing, captions, hashtags, monthly growth reports.", icon_emoji: "📱", accent_color: "#fb7185", order_index: 5, is_active: true },
  { id: "s6", slug: "performance-marketing", title: "Performance Marketing and Paid Ads", short_desc: "Improve your advertising performance with offer audits, creative testing, tracking setup, Meta Ads, Google Ads, and data-based optimization.", long_desc: "Offer audit, creative testing, pixel/CAPI setup, weekly scaling reports with real spend screenshots.", icon_emoji: "📈", accent_color: "#34d399", order_index: 6, is_active: true },
  { id: "s7", slug: "ui-ux-graphic-design", title: "UI/UX and Graphic Design", short_desc: "Build a consistent visual identity with thumbnails, brand kits, social creatives, landing page designs, and user interfaces created in Figma.", long_desc: "Thumbnails, brand kits, social creatives, landing UI in Figma with before/after sample galleries.", icon_emoji: "🎨", accent_color: "#f472b6", order_index: 7, is_active: true },
  { id: "s8", slug: "seo", title: "SEO Services for Growing Businesses", short_desc: "Improve your visibility with technical SEO, keyword research, on-page optimization, Google Business Profile support, local SEO, and backlink strategy.", long_desc: "Technical audit, keywords, on-page, Google Business Profile, backlinks with rank-tracker screenshots.", icon_emoji: "🔍", accent_color: "#60a5fa", order_index: 8, is_active: true },
  { id: "s9", slug: "copywriting-email", title: "Copywriting and Email Marketing", short_desc: "Turn more visitors into customers with website copy, landing pages, welcome sequences, newsletters, email campaigns, and conversion-focused messaging.", long_desc: "Landing copy, 5-email welcome flows, newsletters & campaigns with open-rate reporting.", icon_emoji: "✉️", accent_color: "#facc15", order_index: 9, is_active: true },
];

export const FALLBACK_TEAM: TeamMember[] = [
  { id: "t0", name: "Md Labib Al Dween", role: "Founder & Marketing Strategist", service_slug: null, photo_url: "", bio: "Md Labib Al Dween is the founder and marketing strategist at Islamatrix. Our agency offers Halal business solutions exclusively for Muslim businessmen — you share your goal once, and he plans, executes, and delivers it for you strictly according to Shariah.", specialties: ["Strategy", "Client Success", "Paid Ads"], email: "labib@labibaldween.com", whatsapp: "", portfolio_url: "https://labibaldween.com", order_index: 0, is_active: true, is_founder: true },
];
// No individual profiles are published on the homepage — all work is presented
// as managed by the agency in one place. The managers below appear ONLY on
// the About page, where clients meet who they may talk with after booking.
export const FALLBACK_MANAGERS: TeamMember[] = [
  { id: "m1", name: "Mohammad Mayenul Islam", role: "Manager", service_slug: null, photo_url: "", bio: "", specialties: [], email: "", whatsapp: "", portfolio_url: "", order_index: 1, is_active: true, is_founder: false },
  { id: "m2", name: "Fouzia Khanam", role: "Manager", service_slug: null, photo_url: "", bio: "", specialties: [], email: "", whatsapp: "", portfolio_url: "", order_index: 2, is_active: true, is_founder: false },
  { id: "m3", name: "Md Labib Al Dween", role: "Manager", service_slug: null, photo_url: "", bio: "", specialties: [], email: "", whatsapp: "", portfolio_url: "", order_index: 3, is_active: true, is_founder: false },
  { id: "m4", name: "Abdul Hadi", role: "Manager", service_slug: null, photo_url: "", bio: "", specialties: [], email: "", whatsapp: "", portfolio_url: "", order_index: 4, is_active: true, is_founder: false },
];

// No performance-claim badges anywhere — proof_metric stays empty on all
// items so no ROAS/ranking/retention tags render on the site.
export const FALLBACK_PORTFOLIO: PortfolioItem[] = [
  { id: "p1", service_slug: "video-editing", title: "Documentary Edit — Business Story", description: "Hook + retention editing, animated captions, b-roll. No music version available.", client_name: "", image_url: "https://i.ytimg.com/vi/wXdpIelQlCM/maxresdefault.jpg", embed_url: "https://www.youtube.com/embed/wXdpIelQlCM", embed_type: "youtube", proof_metric: "", is_featured: true, order_index: 1, is_active: true },
  { id: "p3", service_slug: "web-design-development", title: "Dark Agency Website for a Creative Services Brand", description: "Designed and developed a dark, conversion-focused agency website with clear service navigation and a direct booking path for potential clients.", client_name: "Islamatrix", image_url: "", embed_url: "https://editbyporosh.com", embed_type: "website", proof_metric: "", is_featured: true, order_index: 1, is_active: true },
  { id: "p4", service_slug: "performance-marketing", title: "Meta Ads — Lead Gen", description: "Creative testing + CAPI. Full spend reports shared on your call.", client_name: "", image_url: "", embed_url: "", embed_type: "image", proof_metric: "", is_featured: true, order_index: 1, is_active: true },
  { id: "p5", service_slug: "ui-ux-graphic-design", title: "Thumbnail Set", description: "CTR-tested thumbnail system.", client_name: "", image_url: "", embed_url: "", embed_type: "image", proof_metric: "", is_featured: true, order_index: 1, is_active: true },
  { id: "p6", service_slug: "seo", title: "Local SEO — Maps Project", description: "GBP + citations + reviews flow.", client_name: "", image_url: "", embed_url: "", embed_type: "image", proof_metric: "", is_featured: false, order_index: 1, is_active: true },
  { id: "p7", service_slug: "lead-generation-crm", title: "Lead Funnel + CRM Setup", description: "Landing page, lead magnet, CRM pipeline, and automated follow-up in one system.", client_name: "", image_url: "", embed_url: "", embed_type: "image", proof_metric: "", is_featured: false, order_index: 1, is_active: true },
  { id: "p8", service_slug: "business-automation", title: "Lead → WhatsApp Automation", description: "Form → CRM → WhatsApp in 30 seconds.", client_name: "", image_url: "", embed_url: "", embed_type: "image", proof_metric: "", is_featured: false, order_index: 1, is_active: true },
  { id: "p9", service_slug: "social-media-management", title: "30-Day Content System", description: "Calendar + 30 posts + growth report.", client_name: "", image_url: "", embed_url: "", embed_type: "image", proof_metric: "", is_featured: false, order_index: 1, is_active: true },
  { id: "p10", service_slug: "copywriting-email", title: "Welcome Email Flow", description: "5-email flow with open-rate reporting.", client_name: "", image_url: "", embed_url: "", embed_type: "image", proof_metric: "", is_featured: false, order_index: 1, is_active: true },
];

// No placeholder reviews — add real client testimonials here when ready.
export const FALLBACK_TESTIMONIALS: Testimonial[] = [];

// Legal pages — admin-editable via site_settings (privacy_body, privacy_updated,
// terms_body, terms_updated). "## " starts a section heading, blank lines split
// paragraphs, {{email}} renders as a contact email link.
export const FALLBACK_PRIVACY_UPDATED = "September 2026";

export const FALLBACK_PRIVACY_BODY = `## What we collect
When you use the contact form, we receive your name, email address, business or project name, the service you select, your budget range and timeline, and your project description. If you book a strategy call, our scheduling provider receives the booking details you enter, such as your name and email address. If you email us directly, we receive whatever you choose to include. This website has no accounts or client portals, so we do not collect passwords or login data.

## How we use it
We use your details only to respond to your inquiry, prepare for your call, and deliver the services you request — including the reply-within-24-hours follow-up our contact form promises. The contact form asks for your consent before sending, and you must tick that box for the message to go through.

## Email delivery
Contact form messages are delivered through our email provider (EmailJS) directly to our inbox. Messages are not stored in a database on this website.

## Booking provider
Strategy calls are booked through Calendly, which processes your booking details under its own privacy policy. Please review their policy on their website before booking.

## Embedded content and cookies
Some pages embed third-party content such as YouTube videos. Embedded content behaves as if you visited that provider's website and may set cookies or collect viewing data under that provider's own policy. This website itself does not run advertising trackers.

## Data sharing
We do not sell your information and we do not share it with advertisers. Your details are shared only with the service providers needed to operate this site (email delivery, scheduling, and website hosting), and only to the extent required for them to perform their function.

## Data retention
We keep inquiry details only as long as needed to handle your request and any resulting project, or as required by law. You can ask us to delete your details at any time (see Your rights below).

## Your rights
You can ask us what information we hold about you, ask us to correct it, or ask us to delete it. Email {{email}} and we will respond.

## Changes to this policy
If this policy changes, the updated version will be published on this page with a new last-updated date. Continued use of the website after a change means you accept the updated policy.

## Contact
Questions about privacy? Email {{email}}.`;

export const FALLBACK_TERMS_UPDATED = "September 2026";

export const FALLBACK_TERMS_BODY = `## Services and quotes
Islamatrix provides Halal creative, technical, and marketing services exclusively for Muslim businessmen, including video editing, web development, lead generation and CRM, business automation, social media management, paid advertising, design, SEO, and copywriting. Every project starts with a written scope: the agreed deliverables, timeline, pricing, revision policy, and payment schedule. No work begins until you approve that scope.

## Strategy calls
Strategy calls are free and carry no purchase obligation. Advice shared on a call is general guidance only — it becomes a commitment only when written into an agreed project scope.

## Payments
Payment terms depend on the project scope and are confirmed in writing before work begins. Work already completed or delivered is billable as agreed, even if the project is paused or cancelled.

## Revisions and delivery
Each project includes the revision rounds stated in its scope. Revisions are for refining the agreed deliverables; new requirements outside the scope are quoted separately. Delivery dates assume you provide the required content, access, and feedback on time.

## Your responsibilities
You agree to provide the materials we need (logins, brand assets, content, approvals) within a reasonable time, and to ensure you have the rights to any material you supply. Delays on your side may move delivery dates.

## Cancellations
You may cancel a project at any time by writing to us. Amounts for work already done or delivered remain due, and any upfront deposit covers planning and reserved capacity, as stated in your scope.

## Intellectual property
Once you have paid in full, you own the final deliverables created for you under the project scope. Working files, templates, and internal processes remain ours unless your scope states otherwise. You guarantee that materials you supply do not infringe anyone else's rights.

## Confidentiality
We treat your business information as confidential and do not disclose it except as needed to deliver your project or as required by law. Please do not send highly sensitive data (such as full passwords) through the contact form — we will request access securely when needed.

## Portfolio and references
We may showcase completed, non-confidential work in our portfolio unless you ask otherwise in writing before the project starts. We never publish your confidential business data.

## Content standards
All work produced by our agency complies with Islamic Shariah. We do not accept, request, or include haram imagery or scenes in any deliverable — including prohibited visual content and music where the client excludes it. Clients are welcome to share specific content guidelines before production begins, and our team follows them at every stage of the work.

## Fair expectations
Marketing, design, and SEO work is executed professionally against the agreed plan, but specific business outcomes (such as follower counts, rankings, or revenue) cannot be guaranteed and are never promised. Any performance figures shown in samples describe past work, not future results.

## Changes to these terms
We may update these terms; the current version on this page always applies. For ongoing projects, the scope you approved remains unchanged unless we both agree otherwise in writing.

## Contact
Questions about these terms? Email {{email}}.`;

export const FIXED_FAQS: Faq[] = [
  { id: "f0", question: "Do you offer Halal business solutions? Who can work with you?", answer: "Yes. Islamatrix offers Halal business solutions exclusively for Muslim businessmen. We only work with Muslim customers because every service is delivered strictly according to Shariah — from content and marketing to design, automation, and delivery.", order_index: 0, is_active: true },
  { id: "f1", question: "How does booking a call work?", answer: "Click the booking button and choose an available 30-minute time slot. During the call, we will discuss your goals, current challenges, and the services that may be useful. You will not be required to purchase anything during the call.", order_index: 1, is_active: true },
  { id: "f2", question: "Does your video editing follow Islamic Shariah?", answer: "Yes. Our video editing service follows Islamic Shariah, including no music where requested. We can also follow specific content, visual, and delivery guidelines provided by the client before production begins.", order_index: 2, is_active: true },
  { id: "f3", question: "Will I have to deal with multiple freelancers?", answer: "No. Our agency manages every work for you, all in one place. You share your goal once with your point of contact, and we handle the planning, execution, and delivery.", order_index: 3, is_active: true },
  { id: "f4", question: "How do you measure quality?", answer: "Quality depends on the service. We review the agreed deliverables, brand requirements, technical standards, deadlines, and performance metrics defined in the project scope. For marketing and SEO work, reporting and measurement are agreed upon before execution.", order_index: 4, is_active: true },
  { id: "f5", question: "How do payments work?", answer: "Payment terms depend on the project scope. Before work begins, you receive the agreed deliverables, timeline, pricing, revision policy, and payment schedule in writing.", order_index: 5, is_active: true },
  { id: "f6", question: "Do you work with clients outside Bangladesh?", answer: "We currently work with selected remote clients. Contact us with your location and project requirements so we can confirm availability.", order_index: 6, is_active: true },
  { id: "f7", question: "How long does a project take?", answer: "Project timelines vary by service and scope. A landing page, short-form video package, SEO audit, and automation workflow each require different delivery times. We confirm the timeline after reviewing the requirements.", order_index: 7, is_active: true },
];
