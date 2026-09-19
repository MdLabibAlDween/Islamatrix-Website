// Seed the fresh Islamatrix Supabase project with the current site content.
// Usage: npm run seed
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (server-side only, never committed).

import { readFileSync, existsSync } from "fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  for (const p of [".env.local", ".env"]) {
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z_0-9]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        let v = m[2].trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
        process.env[m[1]] = v;
      }
    }
  }
}
loadEnv();

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !SERVICE) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}
const sb = createClient(URL, SERVICE, { auth: { persistSession: false } });

const services = [
  { slug: "video-editing", title: "Professional Video Editing", short_desc: "Create engaging YouTube videos, short-form content, ads, and talking-head videos with captions, color grading, motion graphics, and Islamic Shariah-compliant editing options.", long_desc: "Documentary, talking-head, ads & shorts editing with captions, b-roll, color grade. 100% Islamic Shariah-compliant workflow: no music, no non-hijab footage used without approval.", icon_emoji: "🎬", accent_color: "#f43f5e", order_index: 1, is_active: true },
  { slug: "lead-generation-crm", title: "Lead Generation & CRM Management", short_desc: "Get a steady flow of qualified leads with funnels, lead ads, and CRM follow-up systems that convert inquiries into customers.", long_desc: "Lead funnels, landing pages, Meta/Google lead ads, CRM pipeline setup, and automated WhatsApp/email follow-up with weekly reporting.", icon_emoji: "🧲", accent_color: "#22d3ee", order_index: 2, is_active: true },
  { slug: "web-design-development", title: "High-Performance Website Design", short_desc: "Launch a fast, modern, SEO-ready website built with technologies such as Next.js and Supabase, with analytics and business tools integrated from the start.", long_desc: "Landing pages, business sites & e-commerce. Next.js builds, SEO-ready, analytics, WhatsApp/Calendly integrated.", icon_emoji: "💻", accent_color: "#a78bfa", order_index: 3, is_active: true },
  { slug: "business-automation", title: "Business Process Automation", short_desc: "Reduce repetitive work with CRM systems, lead capture, WhatsApp follow-ups, email automation, invoicing workflows, and Zapier or n8n integrations.", long_desc: "Lead capture → CRM → WhatsApp/email follow-up, invoicing, n8n/Zapier automations with Loom walkthroughs.", icon_emoji: "⚙️", accent_color: "#fbbf24", order_index: 4, is_active: true },
  { slug: "social-media-management", title: "Social Media Management", short_desc: "Plan, create, publish, and measure consistent social media content with content calendars, reels, captions, community support, and monthly reporting.", long_desc: "30-day calendars, reels/shorts repurposing, captions, hashtags, monthly growth reports.", icon_emoji: "📱", accent_color: "#fb7185", order_index: 5, is_active: true },
  { slug: "performance-marketing", title: "Performance Marketing and Paid Ads", short_desc: "Improve your advertising performance with offer audits, creative testing, tracking setup, Meta Ads, Google Ads, and data-based optimization.", long_desc: "Offer audit, creative testing, pixel/CAPI setup, weekly scaling reports with real spend screenshots.", icon_emoji: "📈", accent_color: "#34d399", order_index: 6, is_active: true },
  { slug: "ui-ux-graphic-design", title: "UI/UX and Graphic Design", short_desc: "Build a consistent visual identity with thumbnails, brand kits, social creatives, landing page designs, and user interfaces created in Figma.", long_desc: "Thumbnails, brand kits, social creatives, landing UI in Figma with before/after sample galleries.", icon_emoji: "🎨", accent_color: "#f472b6", order_index: 7, is_active: true },
  { slug: "seo", title: "SEO Services for Growing Businesses", short_desc: "Improve your visibility with technical SEO, keyword research, on-page optimization, Google Business Profile support, local SEO, and backlink strategy.", long_desc: "Technical audit, keywords, on-page, Google Business Profile, backlinks with rank-tracker screenshots.", icon_emoji: "🔍", accent_color: "#60a5fa", order_index: 8, is_active: true },
  { slug: "copywriting-email", title: "Copywriting and Email Marketing", short_desc: "Turn more visitors into customers with website copy, landing pages, welcome sequences, newsletters, email campaigns, and conversion-focused messaging.", long_desc: "Landing copy, 5-email welcome flows, newsletters & campaigns with open-rate reporting.", icon_emoji: "✉️", accent_color: "#facc15", order_index: 9, is_active: true },
];

const portfolio = [
  { service_slug: "video-editing", title: "Documentary Edit — Business Story", description: "Hook + retention editing, animated captions, b-roll. No music version available.", client_name: "", image_url: "https://i.ytimg.com/vi/wXdpIelQlCM/maxresdefault.jpg", embed_url: "https://www.youtube.com/embed/wXdpIelQlCM", embed_type: "youtube", proof_metric: "", is_featured: true, order_index: 1, is_active: true },
  { service_slug: "web-design-development", title: "Dark Agency Website for a Creative Services Brand", description: "Designed and developed a dark, conversion-focused agency website with clear service navigation and a direct booking path for potential clients.", client_name: "Islamatrix", image_url: "", embed_url: "https://editbyporosh.com", embed_type: "website", proof_metric: "", is_featured: true, order_index: 1, is_active: true },
  { service_slug: "performance-marketing", title: "Meta Ads — Lead Gen", description: "Creative testing + CAPI. Full spend reports shared on your call.", client_name: "", image_url: "", embed_url: "", embed_type: "image", proof_metric: "", is_featured: true, order_index: 1, is_active: true },
  { service_slug: "ui-ux-graphic-design", title: "Thumbnail Set", description: "CTR-tested thumbnail system.", client_name: "", image_url: "", embed_url: "", embed_type: "image", proof_metric: "", is_featured: true, order_index: 1, is_active: true },
  { service_slug: "seo", title: "Local SEO — Maps Project", description: "GBP + citations + reviews flow.", client_name: "", image_url: "", embed_url: "", embed_type: "image", proof_metric: "", is_featured: false, order_index: 1, is_active: true },
  { service_slug: "lead-generation-crm", title: "Lead Funnel + CRM Setup", description: "Landing page, lead magnet, CRM pipeline, and automated follow-up in one system.", client_name: "", image_url: "", embed_url: "", embed_type: "image", proof_metric: "", is_featured: false, order_index: 1, is_active: true },
  { service_slug: "business-automation", title: "Lead → WhatsApp Automation", description: "Form → CRM → WhatsApp in 30 seconds.", client_name: "", image_url: "", embed_url: "", embed_type: "image", proof_metric: "", is_featured: false, order_index: 1, is_active: true },
  { service_slug: "social-media-management", title: "30-Day Content System", description: "Calendar + 30 posts + growth report.", client_name: "", image_url: "", embed_url: "", embed_type: "image", proof_metric: "", is_featured: false, order_index: 1, is_active: true },
  { service_slug: "copywriting-email", title: "Welcome Email Flow", description: "5-email flow with open-rate reporting.", client_name: "", image_url: "", embed_url: "", embed_type: "image", proof_metric: "", is_featured: false, order_index: 1, is_active: true },
];

const team = [
  { name: "Md Labib Al Dween", role: "Founder & Marketing Strategist", service_slug: null, photo_url: "", bio: "Md Labib Al Dween is the founder and marketing strategist at Islamatrix. Our agency manages every work for you, all in one place — you share your goal once, and he plans, executes, and delivers it for you.", specialties: ["Strategy", "Client Success", "Paid Ads"], email: "labib@labibaldween.com", whatsapp: "", portfolio_url: "https://labibaldween.com", order_index: 0, is_active: true, is_founder: true },
  { name: "Mohammad Mayenul Islam", role: "Manager", service_slug: null, photo_url: "", bio: "", specialties: [], email: "", whatsapp: "", portfolio_url: "", order_index: 1, is_active: true, is_founder: false },
  { name: "Fouzia Khanam", role: "Manager", service_slug: null, photo_url: "", bio: "", specialties: [], email: "", whatsapp: "", portfolio_url: "", order_index: 2, is_active: true, is_founder: false },
  { name: "Md Labib Al Dween", role: "Manager", service_slug: null, photo_url: "", bio: "", specialties: [], email: "", whatsapp: "", portfolio_url: "", order_index: 3, is_active: true, is_founder: false },
  { name: "Abdul Hadi", role: "Manager", service_slug: null, photo_url: "", bio: "", specialties: [], email: "", whatsapp: "", portfolio_url: "", order_index: 4, is_active: true, is_founder: false },
];

const faqs = [
  { question: "Who can work with you?", answer: "We work exclusively with Muslim businessmen. We only work with Muslim customers because every service is delivered strictly according to Shariah - from content and marketing to design, automation, and delivery.", order_index: 0, is_active: true },
  { question: "How does booking a call work?", answer: "Click the booking button and choose an available 30-minute time slot. During the call, we will discuss your goals, current challenges, and the services that may be useful. You will not be required to purchase anything during the call.", order_index: 1, is_active: true },
  { question: "Does your video editing follow Islamic Shariah?", answer: "Yes. Our video editing service follows Islamic Shariah, including no music where requested. We can also follow specific content, visual, and delivery guidelines provided by the client before production begins.", order_index: 2, is_active: true },
  { question: "Will I have to deal with multiple freelancers?", answer: "No. Our agency manages every work for you, all in one place. You share your goal once with your point of contact, and we handle the planning, execution, and delivery.", order_index: 3, is_active: true },
  { question: "How do you measure quality?", answer: "Quality depends on the service. We review the agreed deliverables, brand requirements, technical standards, deadlines, and performance metrics defined in the project scope. For marketing and SEO work, reporting and measurement are agreed upon before execution.", order_index: 4, is_active: true },
  { question: "How do payments work?", answer: "Payment terms depend on the project scope. Before work begins, you receive the agreed deliverables, timeline, pricing, revision policy, and payment schedule in writing.", order_index: 5, is_active: true },
  { question: "Do you work with clients outside Bangladesh?", answer: "We currently work with selected remote clients. Contact us with your location and project requirements so we can confirm availability.", order_index: 6, is_active: true },
  { question: "How long does a project take?", answer: "Project timelines vary by service and scope. A landing page, short-form video package, SEO audit, and automation workflow each require different delivery times. We confirm the timeline after reviewing the requirements.", order_index: 7, is_active: true },
];

const details = [
  { service_slug: "video-editing", intro: "Get scroll-stopping videos without hiring an in-house editor. We handle YouTube long-form, short-form content, ads, and talking-head videos — edited for retention, captioned, color-graded, and delivered ready to publish.", benefits: ["Videos structured for watch time and retention, not just looks", "Consistent output so your channel or ad account never goes quiet", "Platform-ready formats for YouTube, Reels, Shorts, and TikTok", "Islamic Shariah-compliant workflow available on request, including no-music edits"], deliverables: ["YouTube long-form video edits", "Short-form videos for Reels, Shorts, and TikTok", "Ad creatives for Meta, Google, and TikTok", "Animated captions and subtitles", "Color grading and sound cleanup"], ideal_for: ["YouTubers and creators", "Coaches and consultants", "E-commerce brands"], faqs: [{ q: "Does your video editing follow Islamic Shariah?", a: "Yes. We follow Islamic Shariah, including no music where requested, plus any content, visual, and delivery guidelines you provide before production begins." }, { q: "What do you need from me to start?", a: "Your raw footage or recording, plus a short brief on the goal of the video. We handle the edit, captions, grading, and delivery format." }, { q: "Do you edit short-form and long-form?", a: "Both. Long-form YouTube videos, talking-head content, and repurposed shorts or reels from the same footage." }], meta_title: "Professional Video Editing for Businesses | Islamatrix", meta_desc: "YouTube videos, shorts, ads and talking-head edits with captions, color grading and Islamic Shariah-compliant options. One dedicated team." },
  { service_slug: "lead-generation-crm", intro: "Traffic means nothing without a system that captures and converts it. We build lead funnels, connect your CRM, and automate follow-ups — so every click has the best chance of becoming a customer.", benefits: ["A steady pipeline of qualified leads, not random inquiries", "Every lead captured automatically — none slip through", "Follow-up in minutes, not days, via WhatsApp and email", "Clear cost-per-lead reporting you can read in minutes"], deliverables: ["Lead funnel and landing page setup", "Lead magnet and offer configuration", "Meta and Google lead ad campaigns", "CRM pipeline setup and organization", "WhatsApp and email follow-up automation"], ideal_for: ["Service businesses", "Agencies", "Coaches and consultants"], faqs: [{ q: "How fast will I start getting leads?", a: "Paid campaigns can deliver inquiries quickly once testing finds a working combination — typically within the first few weeks. We set expectations per channel before launch." }, { q: "Do you manage the CRM after setup?", a: "Yes. We configure the pipeline, stages, and automations, then either hand it over with a walkthrough or manage it ongoing — your choice." }, { q: "Who owns the ad account and lead data?", a: "You do. We work inside your accounts so your audiences, leads, and history stay yours." }], meta_title: "Lead Generation & CRM Management Services | Islamatrix", meta_desc: "Lead funnels, CRM setup, and automated follow-ups that turn clicks into customers. One dedicated team." },
  { service_slug: "web-design-development", intro: "Your website should load fast, rank well, and turn visitors into inquiries. We design and build modern business websites and landing pages with clean structure, on-page SEO basics, and analytics and booking tools integrated from the start.", benefits: ["Fast load times that keep visitors from bouncing", "SEO-ready structure: headings, metadata, and sitemaps", "Conversion-focused layouts with clear calls to action", "Analytics and booking tools connected before launch"], deliverables: ["Business websites and landing pages", "Modern development with Next.js", "On-page SEO setup", "Analytics and booking integrations", "Launch support and handover notes"], ideal_for: ["Startups", "Local businesses", "Creators and personal brands"], faqs: [{ q: "How long does a website take?", a: "Timelines depend on scope. A landing page and a full business site need different delivery times — we confirm the timeline after reviewing your requirements." }, { q: "What technologies do you use?", a: "Modern stacks such as Next.js with clean, maintainable code, plus analytics and business-tool integrations." }, { q: "Can you redesign my existing site?", a: "Yes. We audit what you have, keep what works, and rebuild the structure, speed, and messaging around conversions." }], meta_title: "High-Performance Website Design & Development | Islamatrix", meta_desc: "Fast, modern, SEO-ready business websites built with Next.js, with analytics and booking tools integrated from day one." },
  { service_slug: "business-automation", intro: "Stop losing leads to slow follow-up and manual busywork. We connect your forms, CRM, WhatsApp, email, and invoicing into workflows that run themselves — with a walkthrough video so your team can manage them.", benefits: ["Fewer hours lost to repetitive admin work", "Every lead captured and followed up automatically", "Fewer manual errors in bookings, invoices, and records", "Documented workflows your team can actually maintain"], deliverables: ["CRM setup and pipeline configuration", "Lead capture forms connected to your tools", "WhatsApp and email follow-up sequences", "Invoicing and notification workflows", "Zapier or n8n integrations with walkthrough video"], ideal_for: ["Service businesses", "Agencies", "E-commerce stores"], faqs: [{ q: "Which tools do you work with?", a: "Common CRMs, form tools, WhatsApp Business, email platforms, and automation tools such as Zapier and n8n. We recommend the simplest stack that fits your budget." }, { q: "How much time can automation save?", a: "It depends on your current manual workload. On the strategy call we map your process and estimate the savings before you commit." }, { q: "Who maintains the workflows?", a: "You get documentation and a walkthrough video. If you prefer, we can maintain and improve the workflows on an ongoing basis." }], meta_title: "Business Process Automation & CRM Setup | Islamatrix", meta_desc: "CRM setup, lead capture, WhatsApp follow-ups, and Zapier or n8n workflows that remove repetitive work from your week." },
  { service_slug: "social-media-management", intro: "Consistency wins on social media, and consistency takes time you don't have. We plan, create, publish, and measure your content — calendars, reels, captions, and community support — with a monthly report showing what worked.", benefits: ["A consistent presence without daily effort from you", "Content planned weeks ahead, not posted in panic", "Repurposed video and design assets across platforms", "Monthly reporting tied to growth, not vanity metrics"], deliverables: ["30-day content calendar", "Reels and shorts repurposing", "Captions and hashtag sets", "Publishing schedule management", "Monthly growth report"], ideal_for: ["Personal brands and creators", "Local businesses", "Startups building an audience"], faqs: [{ q: "Which platforms do you manage?", a: "The platforms where your audience actually is — typically Instagram, TikTok, YouTube, Facebook, and LinkedIn. We confirm the mix on the strategy call." }, { q: "Do you create the content or just post it?", a: "Both. We plan the calendar, create or edit the creatives with our video and design team, publish, and report." }, { q: "Is ad spend included?", a: "No. Management covers organic content and publishing. Paid promotion is handled under performance marketing with a separate budget." }], meta_title: "Social Media Management for Growing Brands | Islamatrix", meta_desc: "Content calendars, reels, captions, publishing, and monthly reporting — consistent social media done for you." },
  { service_slug: "performance-marketing", intro: "Ads should produce customers, not just clicks. We audit your offer and funnel, set up proper tracking, test creatives systematically, and optimize toward cost-per-result — with weekly reports you can read in five minutes.", benefits: ["Spend managed against results, not impressions", "Structured creative testing instead of guessing", "Correct tracking with pixel and CAPI setup", "Weekly reports with spend, results, and next actions"], deliverables: ["Offer and funnel audit", "Meta, Google, and TikTok campaign setup", "Pixel and conversions API configuration", "Creative testing plan", "Weekly optimization reports"], ideal_for: ["E-commerce brands", "Lead-generation businesses", "Course creators and coaches"], faqs: [{ q: "What budget do I need to start?", a: "It depends on your market and goals. On the strategy call we recommend a starting budget based on your offer and unit economics — management fees are separate from ad spend." }, { q: "How fast will I see results?", a: "Testing phases typically need a few weeks of data before scaling decisions. We set expectations per channel before launch." }, { q: "Who owns the ad account?", a: "You do. We work inside your accounts so your data, audiences, and history stay yours." }], meta_title: "Performance Marketing & Paid Ads Management | Islamatrix", meta_desc: "Meta Ads, Google Ads, and TikTok campaigns with offer audits, creative testing, tracking setup, and weekly reporting." },
  { service_slug: "ui-ux-graphic-design", intro: "People judge your business by how it looks in the first three seconds. We build a consistent visual identity — thumbnails, brand kits, social creatives, and landing page interfaces — designed in Figma and ready for development.", benefits: ["A consistent brand across every touchpoint", "Thumbnails and creatives built for clicks", "Developer-ready files with clean structure", "Source files you own, in Figma"], deliverables: ["YouTube thumbnails and thumbnail systems", "Brand kits: colors, type, and usage rules", "Social media creative packs", "Landing page UI design", "Structured revision rounds"], ideal_for: ["Creators and YouTubers", "Startups", "Agencies needing white-label design"], faqs: [{ q: "What tools do you design in?", a: "Figma for interfaces and layouts, plus Photoshop and Illustrator for brand and creative assets." }, { q: "How many revisions are included?", a: "Structured revision rounds are agreed in writing before work begins, so feedback stays focused and on schedule." }, { q: "Do you offer white-label design?", a: "Yes. Agencies can use our design team under their own brand for client work." }], meta_title: "UI/UX & Graphic Design Services | Islamatrix", meta_desc: "Thumbnails, brand kits, social creatives, and landing page UI designed in Figma. Consistent visuals that get remembered." },
  { service_slug: "seo", intro: "Paid ads stop the moment you stop paying. SEO builds visibility that compounds. We fix technical issues, target keywords your customers actually search, strengthen your Google Business Profile, and track rankings transparently.", benefits: ["Visibility on Google and Google Maps", "Traffic that keeps working without ad spend", "Clear reports: rankings, fixes, and next actions", "Local SEO for businesses serving an area"], deliverables: ["Technical SEO audit", "Keyword research and mapping", "On-page optimization", "Google Business Profile setup and support", "Backlink strategy and rank tracking"], ideal_for: ["Local businesses", "Service companies", "Content sites and blogs"], faqs: [{ q: "How long until SEO shows results?", a: "SEO is a medium-term channel. Technical fixes can help quickly, but competitive rankings typically build over months. We set a realistic timeline after the audit." }, { q: "Do you handle Google Maps and local SEO?", a: "Yes — Business Profile optimization, citations, and review flows for businesses serving a local area." }, { q: "Can you guarantee #1 rankings?", a: "No, and you should distrust anyone who does. We guarantee the work, the reporting, and steady execution against the agreed plan." }], meta_title: "SEO Services for Growing Businesses | Islamatrix", meta_desc: "Technical SEO, keyword research, local SEO, and Google Business Profile support that builds long-term search visibility." },
  { service_slug: "copywriting-email", intro: "Traffic means nothing if your words don't convert. We write website copy, landing pages, and email sequences that explain your value clearly and move readers to act — in a voice that sounds like you on your best day.", benefits: ["Clear messaging visitors understand in seconds", "Higher conversion from the traffic you already have", "Automated email follow-up that sells while you sleep", "One consistent voice across site and inbox"], deliverables: ["Landing page and website copy", "Welcome email sequences", "Newsletters and campaign emails", "Subject lines and CTA optimization", "Messaging review of existing pages"], ideal_for: ["Course creators and coaches", "E-commerce brands", "Startups and SaaS"], faqs: [{ q: "Which email platforms do you work with?", a: "Common platforms such as Mailchimp, Brevo, and ConvertKit. If you use another tool, tell us on the call and we will confirm." }, { q: "How many emails are in a welcome sequence?", a: "Typically five, mapped to your customer journey — but the exact count follows your offer and sales cycle." }, { q: "Do I get revisions?", a: "Yes. Revision rounds are agreed in writing before work begins." }], meta_title: "Website Copywriting & Email Marketing | Islamatrix", meta_desc: "Landing pages, welcome sequences, newsletters, and campaigns written to convert. Clear messaging, consistent voice." },
];

const settings = {
  logo_url: "/logo.png",
  // "1" = no-samples mode (hide all work samples site-wide). Default "" = samples visible.
  hide_samples: "",
  agency_name: "Islamatrix",
  footer_text: "Islamatrix offers business solutions exclusively for Muslim businessmen. Islamatrix is a digital growth agency helping businesses build, market, automate, and protect their online presence through fully managed creative, technical, and marketing services, all in one place.",
  contact_email: "labib@labibaldween.com",
  calendly_url: "https://calendly.com/mdlabibaldween/30min",
  hero_eyebrow: "Business Solutions for Muslim Businessmen - strictly according to Shariah",
  hero_title: "One Digital Growth Agency for Muslim Businesses",
  hero_highlight: "Digital Growth Agency",
  hero_creative: "Let's Bring Life To Your Business",
  hero_subtitle: "Islamatrix offers business solutions exclusively for Muslim businessmen. We only work with Muslim customers because every service is delivered strictly according to Shariah — every work managed for you, all in one place.",
  hero_trust: "Talk with a manager, explain your goals, and get a practical plan for your next stage of growth.",
  stats_config: JSON.stringify([
    { value: "9", label: "Specialized Services" },
    { value: "24h", label: "Response Time" },
    { value: "30min", label: "Free Strategy Call" },
  ]),
  sec_services_eyebrow: "Our Digital Business Services",
  sec_services_title: "Everything Your Business Needs to Grow Online",
  sec_services_highlight: "Grow Online",
  sec_services_sub: "From content production to lead generation, Islamatrix brings skills, strategy, and execution for Muslim businesses under one roof — strictly according to Shariah.",
  sec_pricing_eyebrow: "Pricing",
  sec_pricing_title: "Honest estimate pricing.",
  sec_pricing_highlight: "estimate pricing.",
  sec_pricing_sub: "Estimates only — the exact fee is decided together on your strategy call before any work begins.",
  sec_work_eyebrow: "Work Samples",
  sec_work_title: "See Our Work Samples",
  sec_work_highlight: "Work Samples",
  sec_work_sub: "Explore selected examples of video editing, websites, automation systems, marketing campaigns, design work, SEO deliverables, and copywriting projects.",
  sec_process_label: "How it works",
  sec_process_title: "From First Call to Final Delivery",
  sec_process_highlight: "Final Delivery",
  sec_process_sub: "A simple process keeps your project organized, transparent, and focused on business outcomes.",
  process_config: JSON.stringify([
    { n: "01", title: "Book a free strategy call", desc: "Tell us about your business, goals, and current challenges. We will identify which service or combination of services can help most." },
    { n: "02", title: "Get a clear plan and quote", desc: "Receive a practical scope of work, timeline, deliverables, and pricing before production begins." },
    { n: "03", title: "We create and execute", desc: "Our agency executes your project while keeping communication clear and organized in a single thread — planned, produced, and delivered without you chasing anyone." },
    { n: "04", title: "Launch and improve", desc: "We deliver the work, collect feedback, and provide support or ongoing optimization where needed." },
  ]),
  sec_team_eyebrow: "How we work",
  sec_team_title: "Every Work Managed for You, All in One Place.",
  sec_team_highlight: "All in One Place.",
  sec_team_sub: "You share your goal once — our agency plans, executes, and delivers everything for you, with a single point of contact from start to finish.",
  sec_team_card_title: "Every Service, Handled Under One Roof",
  sec_team_card_text: "Our agency manages every work for you, all in one place. Share your goal once with one of our managers, and we plan the work, handle everything behind the scenes, and deliver the finished result to you.",
  sec_team_tagline: "From Assigning Experts to Delivering Quality Content to You, Our Agency Will Manage Everything for You.",
  sec_testimonials_eyebrow: "What clients say",
  sec_testimonials_title: "What our clients say.",
  sec_testimonials_highlight: "clients say.",
  sec_booking_title: "Ready to Grow Your Business?",
  sec_booking_highlight: "Your Business?",
  sec_booking_sub: "Islamatrix offers business solutions exclusively for Muslim businessmen - tell us what your business needs. We will help you choose the right service, define the next steps, and create a clear plan without unnecessary complexity.",
  sec_faq_eyebrow: "Good to know",
  sec_faq_title: "Frequently asked questions.",
  sec_faq_highlight: "questions.",
  about_eyebrow: "About Me",
  about_name: "Md Labib Al Dween",
  about_name_highlight: "Labib Al Dween",
  about_role: "Founder & CEO",
  about_portfolio_url: "https://labibaldween.com",
  about_intro: "Islamatrix offers business solutions exclusively for Muslim businessmen. Islamatrix is a digital growth agency covering video editing, web development, lead generation, automation, marketing, design, SEO, and copywriting. You share your goal once — our agency plans, executes, and delivers everything, all in one place, with a single point of contact from start to finish.",
  about_step1_title: "Book a call",
  about_step1_desc: "Pick a time that suits you for a free 30-minute strategy call. No commitment, no pressure.",
  about_step2_title: "Talk to the Founder or a Manager",
  about_step2_desc: "Md Labib Al Dween or a manager from our agency joins the call, understands your goal, and maps the right services for it.",
  about_step3_title: "We manage everything",
  about_step3_desc: "Our agency plans, executes, and delivers your complete work — managed for you, all in one place.",
  favicon_url: "/Favicon.png",
  meta_title: "Islamatrix | Business Solutions for Muslim Businessmen",
  meta_description: "Islamatrix offers business solutions exclusively for Muslim businessmen - video editing, web development, lead generation, automation, marketing, SEO, design and copywriting, all strictly according to Shariah — every work managed for you, all in one place.",
  meta_keywords: "digital growth agency, islamic shariah video editing, web design and development, lead generation and CRM services for small business, business process automation, social media management, Meta Ads management, local SEO services, website copywriting, email marketing",
  privacy_updated: "September 2026",
  privacy_body: `## What we collect
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
Questions about privacy? Email {{email}}.`,
  terms_updated: "September 2026",
  terms_body: `## Services and quotes
Islamatrix provides creative, technical, and marketing services exclusively for Muslim businessmen, including video editing, web development, lead generation and CRM, business automation, social media management, paid advertising, design, SEO, and copywriting. Every project starts with a written scope: the agreed deliverables, timeline, pricing, revision policy, and payment schedule. No work begins until you approve that scope.

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
Questions about these terms? Email {{email}}.`,
};

async function main() {
  console.log("Seeding", URL);
  for (const s of services) {
    const { error } = await sb.from("services").upsert(s, { onConflict: "slug" });
    if (error) console.error("services", s.slug, error.message);
  }
  console.log("services ✓");

  await sb.from("portfolio_items").delete().neq("title", "__none__");
  const { error: pErr } = await sb.from("portfolio_items").insert(portfolio);
  if (pErr) console.error("portfolio", pErr.message);
  console.log("portfolio ✓");

  await sb.from("team_members").delete().neq("name", "__none__");
  const { error: tErr } = await sb.from("team_members").insert(team);
  if (tErr) console.error("team", tErr.message);
  console.log("team ✓");

  await sb.from("faqs").delete().neq("question", "__none__");
  const { error: fErr } = await sb.from("faqs").insert(faqs);
  if (fErr) console.error("faqs", fErr.message);
  console.log("faqs ✓");

  for (const d of details) {
    const { error } = await sb.from("service_details").upsert(d, { onConflict: "service_slug" });
    if (error) console.error("details", d.service_slug, error.message);
  }
  console.log("service_details ✓");

  for (const [key, value] of Object.entries(settings)) {
    const { error } = await sb.from("site_settings").upsert({ key, value }, { onConflict: "key" });
    if (error) console.error("settings", key, error.message);
  }
  console.log("site_settings ✓");
  console.log("Done. Create your admin user in Supabase → Authentication → Users, then sign in at /admin");
}

main();
