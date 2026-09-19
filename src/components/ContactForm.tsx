"use client";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { FALLBACK_SERVICES } from "@/lib/fallback-data";
import type { Service } from "@/lib/types";

// Contact form — sends via EmailJS directly from the browser (no backend,
// no stored inbox). Configure the three NEXT_PUBLIC_EMAILJS_* values in
// .env.local. The EmailJS template uses one variable per field:
// {{from_name}} {{from_email}} {{reply_to}} {{business}} {{service}}
// {{budget}} {{timeline}} {{message}}.
// (reply_to is also sent so the Reply button in your inbox works.)

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";
const CONFIGURED = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

const inputCls =
  "w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20";

const BUDGETS = ["Under $500", "$500 – $2,000", "$2,000 – $5,000", "$5,000+"];
const TIMELINES = ["ASAP", "1–2 weeks", "About a month", "Flexible"];

export default function ContactForm({ email, services, agencyName }: { email: string; services?: Service[]; agencyName?: string }) {
  const serviceList = services?.length ? services : FALLBACK_SERVICES;
  const [form, setForm] = useState({
    name: "",
    contact: "",
    business: "",
    service_slug: "",
    budget: "",
    timeline: "",
    description: "",
  });
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (hp) return; // honeypot: bots fill it, humans never see it
    if (!consent) {
      setState("error");
      setMsg("Please tick the consent box so we can reply to your message.");
      return;
    }
    setState("sending");
    setMsg("");
    try {
      const serviceTitle =
        serviceList.find((s) => s.slug === form.service_slug)?.title ?? form.service_slug;
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: form.name.trim(),
          from_email: form.contact.trim(),
          reply_to: form.contact.trim(),
          business: form.business.trim() || "Not specified",
          service: serviceTitle,
          budget: form.budget || "Not specified",
          timeline: form.timeline || "Not specified",
          message: form.description.trim(),
        },
        { publicKey: PUBLIC_KEY }
      );
      setState("done");
    } catch {
      setState("error");
      setMsg("Could not send right now — please try again or email us directly below.");
    }
  }

  if (!CONFIGURED) {
    return (
      <div className="h-full min-h-[480px] grid place-items-center p-8 text-center">
        <div>
          <h3 className="text-xl font-extrabold">Contact form coming right up</h3>
          <p className="mt-2 text-sm text-zinc-400 max-w-sm">
            Email us directly and we&apos;ll reply within 24 hours.
          </p>
          <a
            href={`mailto:${email}`}
            className="mt-5 inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-black hover:bg-violet-300"
          >
            {email}
          </a>
        </div>
      </div>
    );
  }

  if (state === "done") {
    return (
      <div className="h-full min-h-[480px] grid place-items-center p-8 text-center">
        <div>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-400/15 text-2xl text-emerald-300">✓</div>
          <h3 className="mt-4 text-2xl font-extrabold">Message sent</h3>
          <p className="mt-2 text-sm text-zinc-400 max-w-sm">
            Thanks {form.name.split(" ")[0] || "there"} — we&apos;ll reply within 24 hours with next steps.
          </p>
          <button
            onClick={() => {
              setState("idle");
              setConsent(false);
              setForm({ name: "", contact: "", business: "", service_slug: "", budget: "", timeline: "", description: "" });
            }}
            className="mt-5 rounded-full border border-white/15 px-5 py-2.5 text-sm hover:bg-white/10"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  const label = "block text-xs font-semibold uppercase tracking-wider text-zinc-400";
  return (
    <form onSubmit={submit} className="p-6 sm:p-8 space-y-4">
      <h3 className="text-xl font-extrabold">Send us your project details</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className={label}>
          Your name*
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className={`${inputCls} mt-1.5 normal-case`} placeholder="Jane Doe" required maxLength={80} />
        </label>
        <label className={label}>
          Email*
          <input type="email" value={form.contact} onChange={(e) => set("contact", e.target.value)} className={`${inputCls} mt-1.5 normal-case`} placeholder="you@company.com" required maxLength={120} />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className={label}>
          Business / project
          <input value={form.business} onChange={(e) => set("business", e.target.value)} className={`${inputCls} mt-1.5 normal-case`} placeholder="Company or project name" maxLength={120} />
        </label>
        <label className={label}>
          Service needed*
          <select value={form.service_slug} onChange={(e) => set("service_slug", e.target.value)} className={`${inputCls} mt-1.5 normal-case`} required>
            <option value="">Select a service…</option>
            {serviceList.map((s) => (
              <option key={s.slug} value={s.slug}>{s.title}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className={label}>
          Budget
          <select value={form.budget} onChange={(e) => set("budget", e.target.value)} className={`${inputCls} mt-1.5 normal-case`}>
            <option value="">Select…</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </label>
        <label className={label}>
          Timeline
          <select value={form.timeline} onChange={(e) => set("timeline", e.target.value)} className={`${inputCls} mt-1.5 normal-case`}>
            <option value="">Select…</option>
            {TIMELINES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <label className={label}>
        Project description*
        <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} className={`${inputCls} mt-1.5 normal-case`} placeholder="What do you want to build or fix?" required maxLength={2000} />
      </label>
      <label className="flex items-start gap-2.5 text-xs text-zinc-400 leading-relaxed">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-violet-400" />
        I agree that {agencyName?.trim() || "Islamatrix"} may use these details to respond to my inquiry.
      </label>
      {/* Honeypot — invisible to humans */}
      <input type="text" value={hp} onChange={(e) => setHp(e.target.value)} autoComplete="off" tabIndex={-1} className="hidden" aria-hidden="true" />
      {state === "error" && <p className="text-sm text-rose-300">{msg}</p>}
      <button disabled={state === "sending"} className="btn-primary w-full px-6 py-4 text-sm disabled:opacity-50">
        {state === "sending" ? "Sending…" : "Send message →"}
      </button>
      <p className="text-[11px] text-zinc-600 text-center">Free consultation · No commitment · Reply within 24 hours</p>
    </form>
  );
}
