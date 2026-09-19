// Per-service SEO content for /services/[slug] pages.
// Hardcoded while there is no backend. Keep claims verifiable:
// no invented client counts, revenue figures, or performance metrics.

export type ServiceFaq = { q: string; a: string };

export type ServiceContent = {
  cta: string;
  metaTitle: string;
  metaDesc: string;
  h1: string;
  intro: string;
  benefits: string[];
  deliverables: string[];
  idealFor: string[];
  faqs: ServiceFaq[];
};

export const SERVICE_CONTENT: Record<string, ServiceContent> = {
  "video-editing": {
    cta: "Explore Video Editing",
    metaTitle: "Professional Video Editing for Businesses | Islamatrix",
    metaDesc:
      "YouTube videos, shorts, ads and talking-head edits with captions, color grading and Islamic Shariah-compliant options. Every work managed for you, all in one place.",
    h1: "Professional Video Editing",
    intro:
      "Get scroll-stopping videos without the cost of an in-house setup. We handle YouTube long-form, short-form content, ads, and talking-head videos — edited for retention, captioned, color-graded, and delivered ready to publish.",
    benefits: [
      "Videos structured for watch time and retention, not just looks",
      "Consistent output so your channel or ad account never goes quiet",
      "Platform-ready formats for YouTube, Reels, Shorts, and TikTok",
      "Islamic Shariah-compliant workflow available on request, including no-music edits",
    ],
    deliverables: [
      "YouTube long-form video edits",
      "Short-form videos for Reels, Shorts, and TikTok",
      "Ad creatives for Meta, Google, and TikTok",
      "Animated captions and subtitles",
      "Color grading and sound cleanup",
    ],
    idealFor: ["YouTubers and creators", "Coaches and consultants", "E-commerce brands"],
    faqs: [
      { q: "Does your video editing follow Islamic Shariah?", a: "Yes. We follow Islamic Shariah, including no music where requested, plus any content, visual, and delivery guidelines you provide before production begins." },
      { q: "What do you need from me to start?", a: "Your raw footage or recording, plus a short brief on the goal of the video. We handle the edit, captions, grading, and delivery format." },
      { q: "Do you edit short-form and long-form?", a: "Both. Long-form YouTube videos, talking-head content, and repurposed shorts or reels from the same footage." },
    ],
  },
  "lead-generation-crm": {
    cta: "Explore Lead Generation",
    metaTitle: "Lead Generation & CRM Management Services | Islamatrix",
    metaDesc:
      "Lead funnels, CRM setup, and automated follow-ups that turn clicks into customers. Every work managed for you, all in one place.",
    h1: "Lead Generation & CRM Management",
    intro:
      "Traffic means nothing without a system that captures and converts it. We build lead funnels, connect your CRM, and automate follow-ups — so every click has the best chance of becoming a customer.",
    benefits: [
      "A steady pipeline of qualified leads, not random inquiries",
      "Every lead captured automatically — none slip through",
      "Follow-up in minutes, not days, via WhatsApp and email",
      "Clear cost-per-lead reporting you can read in minutes",
    ],
    deliverables: [
      "Lead funnel and landing page setup",
      "Lead magnet and offer configuration",
      "Meta and Google lead ad campaigns",
      "CRM pipeline setup and organization",
      "WhatsApp and email follow-up automation",
    ],
    idealFor: ["Service businesses", "Agencies", "Coaches and consultants"],
    faqs: [
      { q: "How fast will I start getting leads?", a: "Paid campaigns can deliver inquiries quickly once testing finds a working combination — typically within the first few weeks. We set expectations per channel before launch." },
      { q: "Do you manage the CRM after setup?", a: "Yes. We configure the pipeline, stages, and automations, then either hand it over with a walkthrough or manage it ongoing — your choice." },
      { q: "Who owns the ad account and lead data?", a: "You do. We work inside your accounts so your audiences, leads, and history stay yours." },
    ],
  },
  "web-design-development": {
    cta: "Explore Web Development",
    metaTitle: "High-Performance Website Design & Development | Islamatrix",
    metaDesc:
      "Fast, modern, SEO-ready business websites built with Next.js, with analytics and booking tools integrated from day one.",
    h1: "High-Performance Website Design",
    intro:
      "Your website should load fast, rank well, and turn visitors into inquiries. We design and build modern business websites and landing pages with clean structure, on-page SEO basics, and analytics and booking tools integrated from the start.",
    benefits: [
      "Fast load times that keep visitors from bouncing",
      "SEO-ready structure: headings, metadata, and sitemaps",
      "Conversion-focused layouts with clear calls to action",
      "Analytics and booking tools connected before launch",
    ],
    deliverables: [
      "Business websites and landing pages",
      "Modern development with Next.js",
      "On-page SEO setup",
      "Analytics and booking integrations",
      "Launch support and handover notes",
    ],
    idealFor: ["Startups", "Local businesses", "Creators and personal brands"],
    faqs: [
      { q: "How long does a website take?", a: "Timelines depend on scope. A landing page and a full business site need different delivery times — we confirm the timeline after reviewing your requirements." },
      { q: "What technologies do you use?", a: "Modern stacks such as Next.js with clean, maintainable code, plus analytics and business-tool integrations." },
      { q: "Can you redesign my existing site?", a: "Yes. We audit what you have, keep what works, and rebuild the structure, speed, and messaging around conversions." },
    ],
  },
  "business-automation": {
    cta: "Explore Automation",
    metaTitle: "Business Process Automation & CRM Setup | Islamatrix",
    metaDesc:
      "CRM setup, lead capture, WhatsApp follow-ups, and Zapier or n8n workflows that remove repetitive work from your week.",
    h1: "Business Process Automation",
    intro:
      "Stop losing leads to slow follow-up and manual busywork. We connect your forms, CRM, WhatsApp, email, and invoicing into workflows that run themselves — with a walkthrough video so your team can manage them.",
    benefits: [
      "Fewer hours lost to repetitive admin work",
      "Every lead captured and followed up automatically",
      "Fewer manual errors in bookings, invoices, and records",
      "Documented workflows your team can actually maintain",
    ],
    deliverables: [
      "CRM setup and pipeline configuration",
      "Lead capture forms connected to your tools",
      "WhatsApp and email follow-up sequences",
      "Invoicing and notification workflows",
      "Zapier or n8n integrations with walkthrough video",
    ],
    idealFor: ["Service businesses", "Agencies", "E-commerce stores"],
    faqs: [
      { q: "Which tools do you work with?", a: "Common CRMs, form tools, WhatsApp Business, email platforms, and automation tools such as Zapier and n8n. We recommend the simplest stack that fits your budget." },
      { q: "How much time can automation save?", a: "It depends on your current manual workload. On the strategy call we map your process and estimate the savings before you commit." },
      { q: "Who maintains the workflows?", a: "You get documentation and a walkthrough video. If you prefer, we can maintain and improve the workflows on an ongoing basis." },
    ],
  },
  "social-media-management": {
    cta: "Explore Social Media",
    metaTitle: "Social Media Management for Growing Brands | Islamatrix",
    metaDesc:
      "Content calendars, reels, captions, publishing, and monthly reporting — consistent social media done for you.",
    h1: "Social Media Management",
    intro:
      "Consistency wins on social media, and consistency takes time you don't have. We plan, create, publish, and measure your content — calendars, reels, captions, and community support — with a monthly report showing what worked.",
    benefits: [
      "A consistent presence without daily effort from you",
      "Content planned weeks ahead, not posted in panic",
      "Repurposed video and design assets across platforms",
      "Monthly reporting tied to growth, not vanity metrics",
    ],
    deliverables: [
      "30-day content calendar",
      "Reels and shorts repurposing",
      "Captions and hashtag sets",
      "Publishing schedule management",
      "Monthly growth report",
    ],
    idealFor: ["Personal brands and creators", "Local businesses", "Startups building an audience"],
    faqs: [
      { q: "Which platforms do you manage?", a: "The platforms where your audience actually is — typically Instagram, TikTok, YouTube, Facebook, and LinkedIn. We confirm the mix on the strategy call." },
      { q: "Do you create the content or just post it?", a: "Both. We plan the calendar, create or edit the creatives with our video and design team, publish, and report." },
      { q: "Is ad spend included?", a: "No. Management covers organic content and publishing. Paid promotion is handled under performance marketing with a separate budget." },
    ],
  },
  "performance-marketing": {
    cta: "Explore Paid Ads",
    metaTitle: "Performance Marketing & Paid Ads Management | Islamatrix",
    metaDesc:
      "Meta Ads, Google Ads, and TikTok campaigns with offer audits, creative testing, tracking setup, and weekly reporting.",
    h1: "Performance Marketing and Paid Ads",
    intro:
      "Ads should produce customers, not just clicks. We audit your offer and funnel, set up proper tracking, test creatives systematically, and optimize toward cost-per-result — with weekly reports you can read in five minutes.",
    benefits: [
      "Spend managed against results, not impressions",
      "Structured creative testing instead of guessing",
      "Correct tracking with pixel and CAPI setup",
      "Weekly reports with spend, results, and next actions",
    ],
    deliverables: [
      "Offer and funnel audit",
      "Meta, Google, and TikTok campaign setup",
      "Pixel and conversions API configuration",
      "Creative testing plan",
      "Weekly optimization reports",
    ],
    idealFor: ["E-commerce brands", "Lead-generation businesses", "Course creators and coaches"],
    faqs: [
      { q: "What budget do I need to start?", a: "It depends on your market and goals. On the strategy call we recommend a starting budget based on your offer and unit economics — management fees are separate from ad spend." },
      { q: "How fast will I see results?", a: "Testing phases typically need a few weeks of data before scaling decisions. We set expectations per channel before launch." },
      { q: "Who owns the ad account?", a: "You do. We work inside your accounts so your data, audiences, and history stay yours." },
    ],
  },
  "ui-ux-graphic-design": {
    cta: "Explore Design Services",
    metaTitle: "UI/UX & Graphic Design Services | Islamatrix",
    metaDesc:
      "Thumbnails, brand kits, social creatives, and landing page UI designed in Figma. Consistent visuals that get remembered.",
    h1: "UI/UX and Graphic Design",
    intro:
      "People judge your business by how it looks in the first three seconds. We build a consistent visual identity — thumbnails, brand kits, social creatives, and landing page interfaces — designed in Figma and ready for development.",
    benefits: [
      "A consistent brand across every touchpoint",
      "Thumbnails and creatives built for clicks",
      "Developer-ready files with clean structure",
      "Source files you own, in Figma",
    ],
    deliverables: [
      "YouTube thumbnails and thumbnail systems",
      "Brand kits: colors, type, and usage rules",
      "Social media creative packs",
      "Landing page UI design",
      "Structured revision rounds",
    ],
    idealFor: ["Creators and YouTubers", "Startups", "Agencies needing white-label design"],
    faqs: [
      { q: "What tools do you design in?", a: "Figma for interfaces and layouts, plus Photoshop and Illustrator for brand and creative assets." },
      { q: "How many revisions are included?", a: "Structured revision rounds are agreed in writing before work begins, so feedback stays focused and on schedule." },
      { q: "Do you offer white-label design?", a: "Yes. Agencies can use our design team under their own brand for client work." },
    ],
  },
  seo: {
    cta: "Explore SEO Services",
    metaTitle: "SEO Services for Growing Businesses | Islamatrix",
    metaDesc:
      "Technical SEO, keyword research, local SEO, and Google Business Profile support that builds long-term search visibility.",
    h1: "SEO Services for Growing Businesses",
    intro:
      "Paid ads stop the moment you stop paying. SEO builds visibility that compounds. We fix technical issues, target keywords your customers actually search, strengthen your Google Business Profile, and track rankings transparently.",
    benefits: [
      "Visibility on Google and Google Maps",
      "Traffic that keeps working without ad spend",
      "Clear reports: rankings, fixes, and next actions",
      "Local SEO for businesses serving an area",
    ],
    deliverables: [
      "Technical SEO audit",
      "Keyword research and mapping",
      "On-page optimization",
      "Google Business Profile setup and support",
      "Backlink strategy and rank tracking",
    ],
    idealFor: ["Local businesses", "Service companies", "Content sites and blogs"],
    faqs: [
      { q: "How long until SEO shows results?", a: "SEO is a medium-term channel. Technical fixes can help quickly, but competitive rankings typically build over months. We set a realistic timeline after the audit." },
      { q: "Do you handle Google Maps and local SEO?", a: "Yes — Business Profile optimization, citations, and review flows for businesses serving a local area." },
      { q: "Can you guarantee #1 rankings?", a: "No, and you should distrust anyone who does. We guarantee the work, the reporting, and steady execution against the agreed plan." },
    ],
  },
  "copywriting-email": {
    cta: "Explore Copywriting",
    metaTitle: "Website Copywriting & Email Marketing | Islamatrix",
    metaDesc:
      "Landing pages, welcome sequences, newsletters, and campaigns written to convert. Clear messaging, consistent voice.",
    h1: "Copywriting and Email Marketing",
    intro:
      "Traffic means nothing if your words don't convert. We write website copy, landing pages, and email sequences that explain your value clearly and move readers to act — in a voice that sounds like you on your best day.",
    benefits: [
      "Clear messaging visitors understand in seconds",
      "Higher conversion from the traffic you already have",
      "Automated email follow-up that sells while you sleep",
      "One consistent voice across site and inbox",
    ],
    deliverables: [
      "Landing page and website copy",
      "Welcome email sequences",
      "Newsletters and campaign emails",
      "Subject lines and CTA optimization",
      "Messaging review of existing pages",
    ],
    idealFor: ["Course creators and coaches", "E-commerce brands", "Startups and SaaS"],
    faqs: [
      { q: "Which email platforms do you work with?", a: "Common platforms such as Mailchimp, Brevo, and ConvertKit. If you use another tool, tell us on the call and we will confirm." },
      { q: "How many emails are in a welcome sequence?", a: "Typically five, mapped to your customer journey — but the exact count follows your offer and sales cycle." },
      { q: "Do I get revisions?", a: "Yes. Revision rounds are agreed in writing before work begins." },
    ],
  },
};
