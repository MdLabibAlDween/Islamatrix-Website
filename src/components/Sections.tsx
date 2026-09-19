"use client";
import { useState } from "react";
import type { Faq, Testimonial } from "@/lib/types";
import Link from "next/link";
import SectionHead from "./SectionHead";
import GradientTitle from "./Title";
import { applyAgencyName } from "@/lib/site";

export function Testimonials({ items, eyebrow, title, highlight }: {
  items: Testimonial[];
  eyebrow?: string;
  title?: string;
  highlight?: string;
}) {
  if (items.length === 0) return null;
  const row = [...items, ...items];
  return (
    <section id="testimonials" className="py-16 overflow-hidden scroll-mt-20">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead
          eyebrow={eyebrow ?? "What clients say"}
          title={<GradientTitle title={title ?? "What our clients say."} highlight={highlight ?? "clients say."} />}
        />
      </div>
      <div className="mt-8 relative">
        <div className="marquee-track px-5">
          {row.map((t, i) => (
            <div key={`${t.id}-${i}`} className="w-[320px] shrink-0 glass rounded-3xl p-6">
              <div className="text-amber-300 text-sm">{"★".repeat(Math.max(1, Math.min(5, t.rating)))}</div>
              <p className="mt-3 text-sm text-zinc-200 leading-relaxed">“{t.quote}”</p>
              <div className="mt-4 flex items-center gap-3">
                {t.client_avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.client_avatar_url} alt={t.client_name} className="w-10 h-10 rounded-full object-cover border border-white/10" loading="lazy" />
                ) : (
                  <div className="w-10 h-10 rounded-full grid place-items-center font-bold bg-gradient-to-br from-violet-600 to-rose-600">
                    {t.client_name.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold">{t.client_name}</p>
                  <p className="text-xs text-zinc-500">{t.client_role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqAccordion({ items }: {
  items: { id: string; question: string; answer: string }[];
}) {
  // Single-open: opening one FAQ closes the previously opened one.
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      {items.map((f) => {
        const open = openId === f.id;
        return (
          <div key={f.id} className="glass rounded-2xl px-5 py-4">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : f.id)}
              aria-expanded={open}
              className="flex w-full cursor-pointer items-center justify-between gap-4 text-left font-semibold"
            >
              {f.question}
              <span className={`text-xl leading-none text-violet-300 transition-transform ${open ? "rotate-45" : ""}`}>+</span>
            </button>
            {open && (
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{f.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function FaqSection({ faqs, eyebrow, title, highlight }: {
  faqs: Faq[];
  eyebrow?: string;
  title?: string;
  highlight?: string;
}) {
  return (
    <section id="faq" className="px-5 py-16 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <SectionHead
          eyebrow={eyebrow ?? "Good to know"}
          title={<GradientTitle title={title ?? "Frequently asked questions."} highlight={highlight ?? "questions."} />}
        />
        <div className="mt-8">
          <FaqAccordion items={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} />
        </div>
      </div>
    </section>
  );
}

export function Footer({ agencyName, calendlyUrl, copyrightText, footerText, logoUrl, hideSamples }: {
  agencyName: string;
  calendlyUrl: string;
  copyrightText?: string;
  footerText?: string;
  logoUrl?: string;
  hideSamples?: boolean;
}) {
  const year = new Date().getFullYear();
  const line = copyrightText?.trim() || `© ${year} ${agencyName}. All rights reserved.`;
  const DEFAULT_FOOTER =
    "Islamatrix offers business solutions exclusively for Muslim businessmen — helping businesses build, market, automate, and protect their online presence strictly according to Shariah, all in one place.";
  const displayFooter = footerText ?? applyAgencyName(DEFAULT_FOOTER, agencyName);
  return (
    <footer className="px-5 pb-10 pt-6">
      <div className="max-w-6xl mx-auto glass glow-border relative overflow-hidden rounded-[2rem] p-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt={`${agencyName} logo`} className="h-12 sm:h-14 w-auto max-w-[260px] sm:max-w-[300px] object-contain" loading="lazy" />
              ) : (
                <p className="font-black text-xl">{agencyName}</p>
              )}
            </div>
            <p className="mt-2 text-sm text-zinc-400 max-w-sm">{displayFooter}</p>
          </div>
          <div className="text-sm text-zinc-400">
            <p className="font-bold text-white mb-2">Explore</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/#services" className="hover:text-white">Services</Link>
              <Link href="/#pricing" className="hover:text-white">Pricing</Link>
              {!hideSamples && <Link href="/#work" className="hover:text-white">Samples</Link>}
              <Link href="/#team" className="hover:text-white">How We Work</Link>
              <Link href="/about" className="hover:text-white">About Me</Link>
              <Link href="/#faq" className="hover:text-white">FAQs</Link>
              <Link href="/#book" className="hover:text-white">Contact</Link>
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
          <div>
            <a href={calendlyUrl} target="_blank" rel="noreferrer" className="inline-block whitespace-nowrap px-6 py-3 rounded-full bg-white text-black text-sm font-bold hover:bg-violet-300">Book a Free Strategy Call ↗</a>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-5 text-center">
          <p className="text-xs text-zinc-400">{line}</p>
          <p className="mt-1 text-xs text-zinc-500">
            Powered by{" "}
            <a href="https://masters-computer.com" target="_blank" rel="noreferrer" className="underline hover:text-white">
              Master&apos;s Computer
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
