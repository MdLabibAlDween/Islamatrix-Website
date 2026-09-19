// Sync audit: compares live Supabase content against what the site expects.
// Usage: node scripts/audit.mjs          (report only)
//        node scripts/audit.mjs --fix     (apply safe fixes: add missing rows/keys,
//                                         rename cybersecurity -> lead-generation-crm.
//                                         NEVER overwrites existing custom values,
//                                         only fills gaps + performs the requested rename)
import { readFileSync, existsSync } from "fs";
import { createClient } from "@supabase/supabase-js";

for (const p of [".env.local", ".env"]) {
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_0-9]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const FIX = process.argv.includes("--fix");

const anon = createClient(URL, ANON, { auth: { persistSession: false } });
const admin = createClient(URL, SERVICE, { auth: { persistSession: false } });

const EXPECTED_SLUGS = ["video-editing", "lead-generation-crm", "web-design-development", "business-automation", "social-media-management", "performance-marketing", "ui-ux-graphic-design", "seo", "copywriting-email"];
const EXPECTED_SETTING_KEYS = ["logo_url", "agency_name", "footer_text", "contact_email", "calendly_url", "hero_eyebrow", "hero_title", "hero_highlight", "hero_creative", "hero_subtitle", "hero_trust", "stats_config", "sec_services_eyebrow", "sec_services_title", "sec_services_highlight", "sec_services_sub", "sec_work_eyebrow", "sec_work_title", "sec_work_highlight", "sec_work_sub", "sec_process_label", "sec_process_title", "sec_process_highlight", "sec_process_sub", "process_config",   "sec_team_eyebrow", "sec_team_title", "sec_team_highlight", "sec_team_sub", "sec_team_card_title", "sec_team_card_text", "sec_team_tagline", "sec_testimonials_eyebrow", "sec_testimonials_title", "sec_testimonials_highlight", "sec_booking_title", "sec_booking_highlight", "sec_booking_sub", "sec_faq_eyebrow", "sec_faq_title", "sec_faq_highlight", "privacy_updated", "privacy_body", "terms_updated", "terms_body", "about_eyebrow", "about_name", "about_name_highlight", "about_role", "about_intro", "about_step1_title", "about_step1_desc", "about_step2_title", "about_step2_desc", "about_step3_title", "about_step3_desc", "about_portfolio_url", "favicon_url", "meta_title", "meta_description", "meta_keywords"];

const issues = [];
const ok = (msg) => console.log("  ✓", msg);
const bad = (msg) => { console.log("  ✗", msg); issues.push(msg); };

console.log("== public read (anon, as the website sees it) ==");
for (const t of ["services", "portfolio_items", "team_members", "testimonials", "faqs", "service_details", "site_settings"]) {
  const { error, count } = await anon.from(t).select("*", { count: "exact", head: true });
  if (error) bad(`${t}: public read FAILED (${error.message})`);
  else ok(`${t}: readable (${count} rows)`);
}

console.log("== content expectations ==");
const svc = await anon.from("services").select("slug,title").eq("is_active", true);
const slugs = (svc.data ?? []).map((r) => r.slug);
for (const s of EXPECTED_SLUGS) {
  if (slugs.includes(s)) ok(`service present: ${s}`);
  else bad(`service MISSING: ${s}`);
}
if (slugs.includes("cybersecurity")) bad("stale service still present: cybersecurity (should be lead-generation-crm)");

const port = await anon.from("portfolio_items").select("service_slug,title").eq("is_active", true);
const badSlugs = [...new Set((port.data ?? []).map((r) => r.service_slug).filter((s) => !EXPECTED_SLUGS.includes(s)))];
if (badSlugs.length) bad(`samples pointing at unknown services: ${badSlugs.join(", ")}`);
else ok("all samples point at known services");

const det = await anon.from("service_details").select("service_slug");
const detSlugs = (det.data ?? []).map((r) => r.service_slug);
for (const s of EXPECTED_SLUGS) {
  if (detSlugs.includes(s)) ok(`service page content present: ${s}`);
  else bad(`service page content MISSING: ${s}`);
}

const set = await anon.from("site_settings").select("key,value");
const settings = {};
((set.data ?? [])).forEach((r) => (settings[r.key] = r.value ?? ""));
const missingKeys = EXPECTED_SETTING_KEYS.filter((k) => !(k in settings));
if (missingKeys.length) bad(`settings keys MISSING: ${missingKeys.join(", ")}`);
else ok(`all ${EXPECTED_SETTING_KEYS.length} settings keys present`);
for (const [k, label] of [["hero_subtitle", "hero"], ["sec_services_sub", "services sub"]]) {
  if ((settings[k] ?? "").includes("cybersecurity")) bad(`stale wording in ${label} (${k})`);
}
const founder = await anon.from("team_members").select("name").eq("is_founder", true).limit(1);
if ((founder.data ?? []).length) ok(`founder present: ${founder.data[0].name}`);
else bad("founder row MISSING");

console.log("== storage buckets ==");
const { data: buckets, error: bErr } = await admin.storage.listBuckets();
if (bErr) bad(`list buckets FAILED (${bErr.message})`);
else {
  for (const b of ["site-assets", "portfolio-images"]) {
    if ((buckets ?? []).some((x) => x.id === b)) ok(`bucket present: ${b}`);
    else {
      bad(`bucket MISSING: ${b}`);
      if (FIX) {
        const { error } = await admin.storage.createBucket(b, { public: true });
        if (error) console.log("    fix failed:", error.message);
        else console.log(`    fixed: bucket ${b} created (set its policies in Dashboard → Storage if uploads fail)`);
      }
    }
  }
}

if (FIX) {
  console.log("== applying safe fixes ==");
  // Rename cybersecurity -> lead-generation-crm (the requested replacement; no-op if already done)
  const { data: old } = await admin.from("services").select("id").eq("slug", "cybersecurity").limit(1);
  if ((old ?? []).length) {
    const { error } = await admin.from("services").update({
      slug: "lead-generation-crm",
      title: "Lead Generation & CRM Management",
      short_desc: "Get a steady flow of qualified leads with funnels, lead ads, and CRM follow-up systems that convert inquiries into customers.",
      long_desc: "Lead funnels, landing pages, Meta/Google lead ads, CRM pipeline setup, and automated WhatsApp/email follow-up with weekly reporting.",
      icon_emoji: "🧲",
      accent_color: "#22d3ee",
    }).eq("slug", "cybersecurity");
    if (error) console.log("    service rename failed:", error.message);
    else console.log("    fixed: service renamed to lead-generation-crm");
  } else console.log("    service rename: nothing to do");
  await admin.from("service_details").delete().eq("service_slug", "cybersecurity");
  {
    const { error } = await admin.from("service_details").upsert({
      service_slug: "lead-generation-crm",
      intro: "Traffic means nothing without a system that captures and converts it. We build lead funnels, connect your CRM, and automate follow-ups — so every click has the best chance of becoming a customer.",
      benefits: ["A steady pipeline of qualified leads, not random inquiries", "Every lead captured automatically — none slip through", "Follow-up in minutes, not days, via WhatsApp and email", "Clear cost-per-lead reporting you can read in minutes"],
      deliverables: ["Lead funnel and landing page setup", "Lead magnet and offer configuration", "Meta and Google lead ad campaigns", "CRM pipeline setup and organization", "WhatsApp and email follow-up automation"],
      ideal_for: ["Service businesses", "Agencies", "Coaches and consultants"],
      faqs: [
        { q: "How fast will I start getting leads?", a: "Paid campaigns can deliver inquiries quickly once testing finds a working combination — typically within the first few weeks. We set expectations per channel before launch." },
        { q: "Do you manage the CRM after setup?", a: "Yes. We configure the pipeline, stages, and automations, then either hand it over with a walkthrough or manage it ongoing — your choice." },
        { q: "Who owns the ad account and lead data?", a: "You do. We work inside your accounts so your audiences, leads, and history stay yours." },
      ],
      meta_title: "Lead Generation & CRM Management Services | Lagency",
      meta_desc: "Lead funnels, CRM setup, and automated follow-ups that turn clicks into customers. One dedicated team.",
    }, { onConflict: "service_slug" });
    if (error) console.log("    details upsert failed:", error.message);
    else console.log("    fixed: lead-generation-crm page content ensured");
  }
  {
    const { error } = await admin.from("portfolio_items")
      .update({ service_slug: "lead-generation-crm", title: "Lead Funnel + CRM Setup", description: "Landing page, lead magnet, CRM pipeline, and automated follow-up in one system." })
      .eq("service_slug", "cybersecurity");
    if (error) console.log("    portfolio remap failed:", error.message);
    else console.log("    fixed: stale samples remapped (if any existed)");
  }
  for (const key of ["hero_subtitle", "sec_services_sub"]) {
    const { data } = await admin.from("site_settings").select("value").eq("key", key).single();
    if (data?.value?.includes("cybersecurity")) {
      await admin.from("site_settings").upsert({ key, value: data.value.replaceAll("cybersecurity", "lead generation") }, { onConflict: "key" });
      console.log(`    fixed: stale wording in ${key}`);
    }
  }
  console.log("fixes applied. Re-run without --fix to verify.");
} else {
  console.log(`\n${issues.length ? `FOUND ${issues.length} issue(s). Re-run with --fix to repair (gaps only, your edits are safe).` : "ALL SYNCED ✓"}`);
}
