"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase";

/* ============================== shared UI ============================== */

type Supa = ReturnType<typeof getSupabaseBrowser>;
type Toast = { id: number; kind: "ok" | "err"; text: string };

const inputCls =
  "w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 ${className}`}>{children}</div>;
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-[11px] text-zinc-500">{hint}</span>}
    </label>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${value ? "bg-emerald-400" : "bg-zinc-700"}`} aria-pressed={value}>
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${value ? "left-6" : "left-1"}`} />
    </button>
  );
}

function RowToggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5">
      <span className="text-sm text-zinc-300">{label}</span>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

async function uploadImage(sb: Supa, bucket: string, file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file (PNG/JPG/WebP).");
  const ext = (file.name.split(".").pop() || "png").replace(/[^a-zA-Z0-9]/g, "");
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await sb.storage.from(bucket).upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  return sb.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

function UploadBtn({ label, uploading, onFile }: { label: string; uploading: boolean; onFile: (f: File | undefined) => void }) {
  return (
    <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-violet-400/40 bg-violet-500/10 px-4 py-3 text-sm font-semibold text-violet-200 hover:bg-violet-500/20 ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
      {uploading ? "Uploading…" : label}
      <input type="file" accept="image/*" className="hidden" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
    </label>
  );
}

/* ============================== types ============================== */
type Tab = "site" | "hero" | "workspace" | "reviews" | "faqs" | "legal" | "about" | "seo";

const TABS: { id: Tab; label: string }[] = [
  { id: "workspace", label: "Services" },
  { id: "site", label: "Site A� Logo A� Footer" },
  { id: "hero", label: "Hero + Stats" },
  { id: "reviews", label: "Reviews" },
  { id: "faqs", label: "FAQs" },
  { id: "legal", label: "Legal Pages" },
  { id: "about", label: "About Page" },
  { id: "seo", label: "SEO & Favicon" },
];

type Svc = { id?: string; slug: string; title: string; short_desc: string; long_desc: string; icon_emoji: string; accent_color: string; order_index: number; is_active: boolean };
type Sample = { id?: string; service_slug: string; title: string; description: string; client_name: string; image_url: string; embed_url: string; embed_type: string; proof_metric: string; is_featured: boolean; order_index: number; is_active: boolean };
type FaqRow = { id?: string; question: string; answer: string; order_index: number; is_active: boolean };
type Review = { id?: string; client_name: string; client_role: string; client_avatar_url: string; quote: string; rating: number; order_index: number; is_active: boolean };

/* ============================== main page ============================== */

export default function AdminPage() {
  const sb = useMemo(() => getSupabaseBrowser(), []);
  const [user, setUser] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMsg, setAuthMsg] = useState("");
  const [tab, setTabState] = useState<Tab>(() => {
    if (typeof window === "undefined") return "workspace";
    try {
      const saved = window.localStorage.getItem("islamatrix-admin-tab");
      if (saved && (TABS as { id: string }[]).some((t) => t.id === saved)) return saved as Tab;
    } catch { /* storage unavailable — fall through to default */ }
    return "workspace";
  });
  function setTab(t: Tab) {
    setTabState(t);
    try { window.localStorage.setItem("islamatrix-admin-tab", t); } catch { /* ignore */ }
  }
  const [syncId, setSyncId] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const tabIndex = Math.max(0, TABS.findIndex((t) => t.id === tab));

  function goTab(dir: 1 | -1) {
    const next = TABS[(tabIndex + dir + TABS.length) % TABS.length];
    setTab(next.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Let the mouse wheel slide the horizontal tab menu (vertical wheel -> horizontal scroll).
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      if (el.scrollWidth <= el.clientWidth) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);
  const [loading, setLoading] = useState(false);
  // Tabs snapshot settings into useState on mount — so the tab content must
  // NOT mount until the first load finishes, otherwise every form shows
  // empty forever (mounting with the initial empty data poisons the state).
  const [loaded, setLoaded] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [data, setData] = useState<{
    services: Svc[]; samples: Sample[]; team: Record<string, unknown>[];
    reviews: Review[]; faqs: FaqRow[]; settings: Record<string, string>; details: Record<string, Record<string, unknown>>;
  }>({ services: [], samples: [], team: [], reviews: [], faqs: [], settings: {}, details: {} });

  const notify = (kind: Toast["kind"], text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-3), { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  };

  useEffect(() => {
    sb.auth.getSession().then(({ data: s }) => {
      const em = s.session?.user?.email ?? null;
      setUser(em);
      if (em) void reload();
    });
    // Only fresh sign-ins refetch — token refreshes (e.g. refocusing the
    // browser tab) must NOT rebuild the page and wipe form state.
    const { data: sub } = sb.auth.onAuthStateChange((event, sess) => {
      const em = sess?.user?.email ?? null;
      setUser(em);
      if (em && event === "SIGNED_IN") void reload();
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sb]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setAuthMsg("Signing in…");
    const { error } = await sb.auth.signInWithPassword({ email, password });
    setAuthMsg(error ? `Error: ${error.message}` : "Signed in!");
    if (!error) notify("ok", "Welcome back ✓");
  }

  // Quiet by default: refreshes data WITHOUT rebuilding tabs or toasting,
  // so saves and tab switches never wipe selections or drafts. Only the
  // manual Sync button announces + rebuilds forms with fresh data.
  async function reload(announce = false) {
    setLoading(true);
    try {
      const [svc, sam, tea, rev, faq, set, det] = await Promise.all([
        sb.from("services").select("*").order("order_index").limit(100),
        sb.from("portfolio_items").select("*").order("order_index").limit(200),
        sb.from("team_members").select("*").order("order_index").limit(50),
        sb.from("testimonials").select("*").order("order_index").limit(100),
        sb.from("faqs").select("*").order("order_index").limit(100),
        sb.from("site_settings").select("key,value").limit(200),
        sb.from("service_details").select("*").limit(50),
      ]);
      for (const r of [svc, sam, tea, rev, faq, set, det]) {
        if (r.error) throw new Error(r.error.message);
      }
      const settings: Record<string, string> = {};
      ((set.data as { key: string; value: string }[]) ?? []).forEach((r) => (settings[r.key] = r.value ?? ""));
      const details: Record<string, Record<string, unknown>> = {};
      ((det.data as Record<string, unknown>[]) ?? []).forEach((r) => { details[String(r.service_slug)] = r; });
      setData({
        services: (svc.data as Svc[]) ?? [],
        samples: (sam.data as Sample[]) ?? [],
        team: (tea.data as Record<string, unknown>[]) ?? [],
        reviews: (rev.data as Review[]) ?? [],
        faqs: (faq.data as FaqRow[]) ?? [],
        settings, details,
      });
      setLoaded(true);
      if (announce) {
        setSyncId((n) => n + 1);
        notify("ok", "Synced ✓ — public site updates instantly");
      }
    } catch (err: unknown) {
      notify("err", err instanceof Error ? err.message : "Sync failed");
    }
    setLoading(false);
  }

  async function remove(table: string, id: string, label: string) {
    if (!confirm(`Delete "${label}"?`)) return;
    const { error } = await sb.from(table).delete().eq("id", id);
    if (error) notify("err", error.message);
    else { notify("ok", "Deleted ✓"); reload(); }
  }

  if (!user) {
    return (
      <main className="admin-native min-h-screen bg-[#060606] text-zinc-100 grid place-items-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <span className="inline-grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-500 text-black font-black text-xl">L</span>
            <h1 className="mt-3 text-2xl font-extrabold">Islamatrix Admin</h1>
            <p className="mt-1 text-sm text-zinc-400">Sign in to edit every section of your site.</p>
          </div>
          <form onSubmit={login} className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 space-y-4">
            <Field label="Admin email">
              <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@company.com" required />
            </Field>
            <Field label="Password">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="••••••••" required />
            </Field>
            <button className="w-full rounded-xl bg-white py-3 font-bold text-black hover:bg-violet-300">Sign In</button>
            {authMsg && <p className="text-center text-sm text-amber-200">{authMsg}</p>}
            <p className="text-center text-xs text-zinc-500">Create this user first in Supabase → Authentication → Add user.</p>
          </form>
          <Link href="/" className="mt-4 block text-center text-sm text-zinc-500 hover:text-white">← Back to site</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-native min-h-screen bg-[#060606] text-zinc-100">
      <div className="fixed bottom-5 right-5 z-[100] space-y-2 w-[320px] max-w-[calc(100vw-40px)]">
        {toasts.map((t) => (
          <div key={t.id} className={`rounded-2xl border px-4 py-3 text-sm shadow-2xl ${t.kind === "ok" ? "border-emerald-400/40 bg-emerald-950/90 text-emerald-100" : "border-rose-400/40 bg-rose-950/90 text-rose-100"}`}>
            {t.text}
          </div>
        ))}
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-3 px-5">
          <div className="flex items-center gap-2 font-black">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-500 text-black">{((data.settings.agency_name || "L").trim().slice(0, 1) || "L").toUpperCase()}</span>
            <span className="hidden sm:inline">{data.settings.agency_name?.trim() || "Islamatrix"} Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-xs text-zinc-500 max-w-[200px] truncate">{user}</span>
            <a href="/" target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold hover:bg-white/10">View site ↗</a>
            <button onClick={() => { reload(true); }} className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold hover:bg-white/10">{loading ? "Syncing…" : "↻ Sync"}</button>
            <button onClick={() => sb.auth.signOut().then(() => setUser(null))} className="rounded-full bg-white px-4 py-2 text-xs font-bold text-black">Logout</button>
          </div>
        </div>
      </header>

      {!loaded ? (
        <div className="mx-auto max-w-[1400px] px-5 py-20 text-center">
          <p className="text-sm text-zinc-400">{loading ? "Loading site data…" : "Sign in to load site data."}</p>
        </div>
      ) : (
      <>
      <div className="mx-auto max-w-[1400px] px-5 pt-6">
        <QuickBrandCard key={`brand-${syncId}`} sb={sb} current={data.settings.agency_name ?? ""} onChanged={reload} notify={notify} />
        <SamplesModeCard key={`samples-${syncId}`} sb={sb} current={data.settings.hide_samples ?? ""} currentGallery={data.settings.hide_gallery ?? ""} onChanged={() => { void reload(true); }} notify={notify} />
      </div>
      <div className="mx-auto grid max-w-[1400px] gap-5 px-5 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-20 h-fit">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navRef.current?.scrollBy({ left: -240, behavior: "smooth" })}
              aria-label="Slide menu left"
              className="shrink-0 rounded-full border border-white/15 px-3 py-2 text-sm hover:bg-white/10 lg:hidden"
            >
              ←
            </button>
            <nav ref={navRef} className="flex flex-1 gap-2 overflow-x-auto lg:flex-col">
              {TABS.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`min-w-[150px] lg:min-w-0 rounded-2xl border px-4 py-3 text-left text-sm font-bold transition-all ${tab === t.id ? "border-violet-400/50 bg-violet-500/15" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"}`}>
                  {t.label}
                </button>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => navRef.current?.scrollBy({ left: 240, behavior: "smooth" })}
              aria-label="Slide menu right"
              className="shrink-0 rounded-full border border-white/15 px-3 py-2 text-sm hover:bg-white/10 lg:hidden"
            >
              →
            </button>
          </div>
        </aside>
        <div className="min-w-0">
          {/* All tabs stay mounted (hidden when inactive) so switching tabs never
              wipes selections, drafts, or scroll position. */}
          <div className={tab === "workspace" ? "" : "hidden"}><WorkspaceTab key={`workspace-${syncId}`} sb={sb} services={data.services} samples={data.samples} settings={data.settings} details={data.details} onChanged={reload} onDelete={remove} notify={notify} /></div>
          <div className={tab === "site" ? "" : "hidden"}><SiteTab key={`site-${syncId}`} sb={sb} settings={data.settings} onChanged={reload} notify={notify} /></div>
          <div className={tab === "hero" ? "" : "hidden"}><HeroTab key={`hero-${syncId}`} sb={sb} settings={data.settings} onChanged={reload} notify={notify} /></div>
          <div className={tab === "reviews" ? "" : "hidden"}><ReviewsTab sb={sb} items={data.reviews} onChanged={reload} onDelete={remove} notify={notify} /></div>
          <div className={tab === "faqs" ? "" : "hidden"}><FaqsTab sb={sb} items={data.faqs} onChanged={reload} onDelete={remove} notify={notify} /></div>
          <div className={tab === "legal" ? "" : "hidden"}><LegalTab key={`legal-${syncId}`} sb={sb} settings={data.settings} onChanged={reload} notify={notify} /></div>
          <div className={tab === "about" ? "" : "hidden"}><AboutTab key={`about-${syncId}`} sb={sb} settings={data.settings} onChanged={reload} notify={notify} /></div>
          <div className={tab === "seo" ? "" : "hidden"}><SEOTab key={`seo-${syncId}`} sb={sb} settings={data.settings} onChanged={reload} notify={notify} /></div>
          <div className="mt-5 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => goTab(-1)}
              className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold hover:bg-white/10"
            >
              ← {TABS[(tabIndex - 1 + TABS.length) % TABS.length].label}
            </button>
            <span className="text-xs text-zinc-500">{tabIndex + 1} / {TABS.length}</span>
            <button
              type="button"
              onClick={() => goTab(1)}
              className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold hover:bg-white/10"
            >
              {TABS[(tabIndex + 1) % TABS.length].label} →
            </button>
          </div>
        </div>
      </div>
      </>
      )}
    </main>
  );
}

type TabProps = { sb: Supa; onChanged: () => void; notify: (k: Toast["kind"], t: string) => void };

/* ============================== quick brand: one name everywhere ============================== */

function QuickBrandCard({ sb, current, onChanged, notify }: TabProps & { current: string }) {
  const [name, setName] = useState(current || "Islamatrix");
  const [saving, setSaving] = useState(false);

  async function save() {
    const clean = name.trim();
    if (!clean) return notify("err", "Agency name cannot be empty.");
    setSaving(true);
    const { error } = await sb.from("site_settings").upsert({ key: "agency_name", value: clean }, { onConflict: "key" });
    setSaving(false);
    if (error) notify("err", error.message);
    else {
      notify("ok", `Brand switched to “${clean}” ✓ — live everywhere on the site`);
      onChanged();
    }
  }

  async function reset() {
    setSaving(true);
    const { error } = await sb.from("site_settings").upsert({ key: "agency_name", value: "Islamatrix" }, { onConflict: "key" });
    setSaving(false);
    if (error) notify("err", error.message);
    else {
      setName("Islamatrix");
      notify("ok", "Brand reset to Islamatrix ✓");
      onChanged();
    }
  }

  return (
    <div className="rounded-3xl border border-violet-400/40 bg-gradient-to-r from-violet-500/[0.12] via-fuchsia-500/[0.08] to-rose-500/[0.10] p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-500 text-lg font-black text-black">⚡</span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base sm:text-lg font-extrabold">Quick Brand — Agency name</h2>
          <p className="mt-0.5 text-xs sm:text-sm text-zinc-400">
            Change one value and every “Islamatrix” on the website switches to it instantly — navbar, hero, sections, “handled by” card, footer, consent line, service pages & browser titles.
            Currently live: <span className="font-bold text-white">{current?.trim() || "Islamatrix"}</span>
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
          placeholder="e.g. Nova Studio"
          maxLength={60}
        />
        <div className="flex gap-2 shrink-0">
          <button onClick={save} disabled={saving} className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-violet-300 disabled:opacity-50">
            {saving ? "Applying…" : "Apply to whole site"}
          </button>
          <button onClick={reset} disabled={saving} className="rounded-xl border border-white/15 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/10 disabled:opacity-50">
            Reset
          </button>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-zinc-500">Instant & reversible — no other text is rewritten in the database. Set it back to “Islamatrix” anytime to restore.</p>
    </div>
  );
}

/* ============================== samples mode: show / hide portfolio ============================== */

function SamplesModeCard({ sb, current, currentGallery, onChanged, notify }: TabProps & { current: string; currentGallery?: string }) {
  const [saving, setSaving] = useState(false);
  const [savingGallery, setSavingGallery] = useState(false);
  const hidden = (current ?? "").trim() === "1";
  const galleryOff = (currentGallery ?? "").trim() === "1";

  async function flip() {
    if (saving) return;
    setSaving(true);
    const next = hidden ? "" : "1";
    const { error } = await sb.from("site_settings").upsert({ key: "hide_samples", value: next }, { onConflict: "key" });
    setSaving(false);
    if (error) notify("err", error.message);
    else {
      notify("ok", next === "1" ? "Work samples hidden site-wide ✓" : "Work samples visible site-wide ✓");
      onChanged();
    }
  }

  async function flipGallery() {
    if (savingGallery) return;
    setSavingGallery(true);
    const next = galleryOff ? "" : "1";
    const { error } = await sb.from("site_settings").upsert({ key: "hide_gallery", value: next }, { onConflict: "key" });
    setSavingGallery(false);
    if (error) notify("err", error.message);
    else {
      notify("ok", next === "1" ? "Gallery view hidden — portfolio stays ✓" : "Gallery view visible ✓");
      onChanged();
    }
  }

  return (
    <div className="mt-4 rounded-3xl border border-emerald-400/40 bg-gradient-to-r from-emerald-500/[0.12] via-teal-500/[0.08] to-cyan-500/[0.10] p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-lg font-black text-black">👁</span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base sm:text-lg font-extrabold">Visibility — samples + gallery on / off</h2>
          <p className="mt-0.5 text-xs sm:text-sm text-zinc-400">
            Currently: <span className="font-bold text-white">{hidden ? "samples HIDDEN — site sells services only" : "samples VISIBLE across the site"}</span>
            {" · "}
            <span className="font-bold text-white">{galleryOff ? "gallery HIDDEN" : "gallery VISIBLE"}</span>
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <RowToggle label={saving ? "Saving…" : "Hide work samples site-wide (hides everything)"} value={hidden} onChange={() => { void flip(); }} />
        <RowToggle label={savingGallery ? "Saving…" : "Hide gallery view only (portfolio stays)"} value={galleryOff} onChange={() => { void flipGallery(); }} />
      </div>
      <p className="mt-2 text-[11px] text-zinc-500">Instant & reversible — nothing is deleted, sections just hide until you switch back. Full-hide wins over gallery-hide.</p>
    </div>
  );
}

/* ============================== site: logo + footer + contact ============================== */

const SITE_FIELDS = [
  { key: "agency_name", label: "Agency name (same as Quick Brand — replaces every “Islamatrix” site-wide)" },
  { key: "contact_email", label: "Contact email" },
  { key: "calendly_url", label: "Calendly booking link" },
  { key: "footer_text", label: "Footer text", big: true },
] as const;

function SiteTab({ sb, settings, onChanged, notify }: TabProps & { settings: Record<string, string> }) {
  const [vals, setVals] = useState<Record<string, string>>(settings);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function onLogo(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(sb, "site-assets", file);
      setVals((v) => ({ ...v, logo_url: url }));
      notify("ok", "Logo uploaded — save below to publish ✓");
    } catch (e: unknown) {
      notify("err", e instanceof Error ? e.message : "Upload failed");
    }
    setUploading(false);
  }

  async function save() {
    setSaving(true);
    const keys = ["logo_url", ...SITE_FIELDS.map((f) => f.key)];
    for (const key of keys) {
      const { error } = await sb.from("site_settings").upsert({ key, value: vals[key] ?? "" }, { onConflict: "key" });
      if (error) { notify("err", `${key}: ${error.message}`); setSaving(false); return; }
    }
    setSaving(false);
    notify("ok", "Site settings saved ✓ — live on site");
    onChanged();
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div><h2 className="text-xl font-extrabold">Site · Logo · Footer</h2>
        <p className="mt-1 text-sm text-zinc-500">Logo, name, contact email, booking link, footer text.</p></div>
      <Card>
        <h3 className="font-extrabold">Logo</h3>
        <p className="mt-0.5 text-xs text-zinc-500">Shows in the navbar and footer. Leave empty to use /logo.png from the public folder.</p>
        <div className="mt-3 flex items-center gap-4">
          <div className="grid h-16 w-40 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-black/40 px-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={vals.logo_url || "/logo.png"} alt="Logo preview" className="h-full w-full object-contain" />
          </div>
          <div className="flex-1 space-y-2">
            <UploadBtn label="↑ Upload logo (PNG)" uploading={uploading} onFile={onLogo} />
            <input value={vals.logo_url ?? ""} onChange={(e) => setVals({ ...vals, logo_url: e.target.value })} className={inputCls} placeholder="/logo.png or https://… or upload above" />
          </div>
          {vals.logo_url && <button onClick={() => setVals({ ...vals, logo_url: "" })} className="shrink-0 rounded-full border border-rose-400/40 px-3 py-1.5 text-xs text-rose-300">Remove</button>}
        </div>
      </Card>
      <Card>
        <div className="space-y-4">
          {SITE_FIELDS.map((f) => (
            <Field key={f.key} label={f.label}>
              {"big" in f && f.big ? (
                <textarea value={vals[f.key] ?? ""} onChange={(e) => setVals({ ...vals, [f.key]: e.target.value })} rows={3} className={inputCls} />
              ) : (
                <input value={vals[f.key] ?? ""} onChange={(e) => setVals({ ...vals, [f.key]: e.target.value })} className={inputCls} />
              )}
            </Field>
          ))}
        </div>
      </Card>
      <button onClick={save} disabled={saving || uploading} className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-violet-300 disabled:opacity-50">
        {saving ? "Saving…" : "Save site settings"}
      </button>
    </div>
  );
}

/* ============================== legal: privacy + terms pages ============================== */

const LEGAL_KEYS = ["privacy_updated", "privacy_body", "terms_updated", "terms_body"];

function LegalTab({ sb, settings, onChanged, notify }: TabProps & { settings: Record<string, string> }) {
  const [vals, setVals] = useState<Record<string, string>>(settings);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    for (const key of LEGAL_KEYS) {
      const { error } = await sb.from("site_settings").upsert({ key, value: vals[key] ?? "" }, { onConflict: "key" });
      if (error) { notify("err", `${key}: ${error.message}`); setSaving(false); return; }
    }
    setSaving(false);
    notify("ok", "Legal pages saved ✓ — live on /privacy and /terms");
    onChanged();
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div><h2 className="text-xl font-extrabold">Legal Pages</h2>
        <p className="mt-1 text-sm text-zinc-500">Edits the /privacy and /terms pages. Use “## Title” for a section heading, a blank line between paragraphs, and {"{{email}}"} where the contact email link should appear.</p></div>
      <Card>
        <h3 className="font-extrabold">Privacy Policy <span className="ml-1 text-xs font-semibold text-zinc-500">→ /privacy</span></h3>
        <div className="mt-3 space-y-4">
          <Field label="Last updated line">
            <input value={vals.privacy_updated ?? ""} onChange={(e) => setVals({ ...vals, privacy_updated: e.target.value })} className={inputCls} placeholder="September 2026" />
          </Field>
          <Field label="Privacy body">
            <textarea value={vals.privacy_body ?? ""} onChange={(e) => setVals({ ...vals, privacy_body: e.target.value })} rows={16} className={`${inputCls} font-mono`} />
          </Field>
        </div>
      </Card>
      <Card>
        <h3 className="font-extrabold">Terms of Service <span className="ml-1 text-xs font-semibold text-zinc-500">→ /terms</span></h3>
        <div className="mt-3 space-y-4">
          <Field label="Last updated line">
            <input value={vals.terms_updated ?? ""} onChange={(e) => setVals({ ...vals, terms_updated: e.target.value })} className={inputCls} placeholder="September 2026" />
          </Field>
          <Field label="Terms body">
            <textarea value={vals.terms_body ?? ""} onChange={(e) => setVals({ ...vals, terms_body: e.target.value })} rows={16} className={`${inputCls} font-mono`} />
          </Field>
        </div>
      </Card>
      <button onClick={save} disabled={saving} className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-violet-300 disabled:opacity-50">
        {saving ? "Saving…" : "Save legal pages"}
      </button>
    </div>
  );
}

/* ============================== about page ============================== */

const ABOUT_KEYS = [
  "about_eyebrow", "about_name", "about_name_highlight", "about_role", "about_intro", "about_portfolio_url",
  "about_step1_title", "about_step1_desc",
  "about_step2_title", "about_step2_desc",
  "about_step3_title", "about_step3_desc",
];

function AboutTab({ sb, settings, onChanged, notify }: TabProps & { settings: Record<string, string> }) {
  const [vals, setVals] = useState<Record<string, string>>(settings);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    for (const key of ABOUT_KEYS) {
      const { error } = await sb.from("site_settings").upsert({ key, value: vals[key] ?? "" }, { onConflict: "key" });
      if (error) { notify("err", `${key}: ${error.message}`); setSaving(false); return; }
    }
    setSaving(false);
    notify("ok", "About page saved ✓ — live on /about");
    onChanged();
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div><h2 className="text-xl font-extrabold">About Page</h2>
        <p className="mt-1 text-sm text-zinc-500">Edits the /about page. Highlight words must match the name text exactly.</p></div>
      <Card>
        <h3 className="font-extrabold">Header</h3>
        <div className="mt-3 space-y-4">
          <Field label="Eyebrow (small pill above name)">
            <input value={vals.about_eyebrow ?? ""} onChange={(e) => setVals({ ...vals, about_eyebrow: e.target.value })} className={inputCls} placeholder="About Me" />
          </Field>
          <Field label="Name (headline)">
            <input value={vals.about_name ?? ""} onChange={(e) => setVals({ ...vals, about_name: e.target.value })} className={inputCls} placeholder="Md Labib Al Dween" />
          </Field>
          <Field label="Gradient highlight words (must match name text)">
            <input value={vals.about_name_highlight ?? ""} onChange={(e) => setVals({ ...vals, about_name_highlight: e.target.value })} className={inputCls} placeholder="Labib Al Dween" />
          </Field>
          <Field label="Role badge (agency name is added automatically)">
            <input value={vals.about_role ?? ""} onChange={(e) => setVals({ ...vals, about_role: e.target.value })} className={inputCls} placeholder="Founder & CEO" />
          </Field>
          <Field label="Intro paragraph">
            <textarea value={vals.about_intro ?? ""} onChange={(e) => setVals({ ...vals, about_intro: e.target.value })} rows={4} className={inputCls} />
          </Field>
          <Field label="Portfolio link (button, empty hides it)">
            <input value={vals.about_portfolio_url ?? ""} onChange={(e) => setVals({ ...vals, about_portfolio_url: e.target.value })} className={inputCls} placeholder="https://labibaldween.com" />
          </Field>
        </div>
      </Card>
      <Card>
        <h3 className="font-extrabold">How-it-works steps (3)</h3>
        <div className="mt-3 space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-2xl border border-white/10 bg-black/40 p-3 space-y-2">
              <p className="text-xs font-black text-violet-300">Step {n}</p>
              <input value={vals[`about_step${n}_title`] ?? ""} onChange={(e) => setVals({ ...vals, [`about_step${n}_title`]: e.target.value })} className={inputCls} placeholder="Step title" />
              <textarea value={vals[`about_step${n}_desc`] ?? ""} onChange={(e) => setVals({ ...vals, [`about_step${n}_desc`]: e.target.value })} rows={2} className={inputCls} placeholder="Step description" />
            </div>
          ))}
        </div>
      </Card>
      <button onClick={save} disabled={saving} className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-violet-300 disabled:opacity-50">
        {saving ? "Saving…" : "Save about page"}
      </button>
    </div>
  );
}

/* ============================== seo + favicon ============================== */

const SEO_KEYS = ["favicon_url", "meta_title", "meta_description", "meta_keywords"];

function SEOTab({ sb, settings, onChanged, notify }: TabProps & { settings: Record<string, string> }) {
  const [vals, setVals] = useState<Record<string, string>>(settings);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function onFavicon(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(sb, "site-assets", file);
      setVals((v) => ({ ...v, favicon_url: url }));
      notify("ok", "Favicon uploaded — save below to publish ✓");
    } catch (e: unknown) {
      notify("err", e instanceof Error ? e.message : "Upload failed");
    }
    setUploading(false);
  }

  async function save() {
    setSaving(true);
    for (const key of SEO_KEYS) {
      const { error } = await sb.from("site_settings").upsert({ key, value: vals[key] ?? "" }, { onConflict: "key" });
      if (error) { notify("err", `${key}: ${error.message}`); setSaving(false); return; }
    }
    setSaving(false);
    notify("ok", "SEO saved ✓ — live on site (titles may take a while to update in Google)");
    onChanged();
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div><h2 className="text-xl font-extrabold">SEO & Favicon</h2>
        <p className="mt-1 text-sm text-zinc-500">Browser tab icon plus the title, description, and keywords search engines and social previews show.</p></div>
      <Card>
        <h3 className="font-extrabold">Favicon</h3>
        <p className="mt-0.5 text-xs text-zinc-500">The small icon in browser tabs. Square PNG works best. Leave empty to use /Favicon.png from the public folder.</p>
        <div className="mt-3 flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={vals.favicon_url || "/Favicon.png"} alt="Favicon preview" className="h-full w-full object-contain" />
          </div>
          <div className="flex-1 space-y-2">
            <UploadBtn label="↑ Upload favicon (PNG)" uploading={uploading} onFile={onFavicon} />
            <input value={vals.favicon_url ?? ""} onChange={(e) => setVals({ ...vals, favicon_url: e.target.value })} className={inputCls} placeholder="/Favicon.png or https://… or upload above" />
          </div>
          {vals.favicon_url && <button onClick={() => setVals({ ...vals, favicon_url: "" })} className="shrink-0 rounded-full border border-rose-400/40 px-3 py-1.5 text-xs text-rose-300">Remove</button>}
        </div>
      </Card>
      <Card>
        <h3 className="font-extrabold">Search & social preview</h3>
        <div className="mt-3 space-y-4">
          <Field label="Meta title (browser tab + Google headline)" hint="Keep under ~60 characters.">
            <input value={vals.meta_title ?? ""} onChange={(e) => setVals({ ...vals, meta_title: e.target.value })} className={inputCls} placeholder="Islamatrix | Business Solutions for Muslim Businessmen" maxLength={120} />
          </Field>
          <Field label="Meta description (Google snippet + link previews)" hint="Keep under ~160 characters.">
            <textarea value={vals.meta_description ?? ""} onChange={(e) => setVals({ ...vals, meta_description: e.target.value })} rows={3} className={inputCls} maxLength={320} />
          </Field>
          <Field label="Keywords (comma separated)">
            <input value={vals.meta_keywords ?? ""} onChange={(e) => setVals({ ...vals, meta_keywords: e.target.value })} className={inputCls} placeholder="digital growth agency, video editing, …" />
          </Field>
        </div>
      </Card>
      <button onClick={save} disabled={saving || uploading} className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-violet-300 disabled:opacity-50">
        {saving ? "Saving…" : "Save SEO"}
      </button>
    </div>
  );
}

/* ============================== hero + stats + headings ============================== */

const HERO_FIELDS = [
  { key: "hero_eyebrow", label: "Eyebrow (small pill above headline)", big: true },
  { key: "hero_title", label: "Headline (H1)", big: true },
  { key: "hero_highlight", label: "Gradient highlight words (must match headline text)" },
  { key: "hero_creative", label: "Creative second line" },
  { key: "hero_trust", label: "Trust line under buttons" },
] as const;

const HEADING_GROUPS = [
  { title: "Services section", fields: ["sec_services_eyebrow", "sec_services_title", "sec_services_highlight", "sec_services_sub"] },
  { title: "Pricing section", fields: ["sec_pricing_eyebrow", "sec_pricing_title", "sec_pricing_highlight", "sec_pricing_sub"] },
  { title: "Work Samples section", fields: ["sec_work_eyebrow", "sec_work_title", "sec_work_highlight", "sec_work_sub"] },
  { title: "Process section", fields: ["sec_process_label", "sec_process_title", "sec_process_highlight", "sec_process_sub"] },
  { title: "How We Work section", fields: ["sec_team_eyebrow", "sec_team_title", "sec_team_highlight", "sec_team_sub", "sec_team_card_title", "sec_team_card_text", "sec_team_tagline"] },
  { title: "Reviews section", fields: ["sec_testimonials_eyebrow", "sec_testimonials_title", "sec_testimonials_highlight"] },
  { title: "FAQ section", fields: ["sec_faq_eyebrow", "sec_faq_title", "sec_faq_highlight"] },
  { title: "Booking section", fields: ["sec_booking_title", "sec_booking_highlight", "sec_booking_sub"] },
];

function HeroTab({ sb, settings, onChanged, notify }: TabProps & { settings: Record<string, string> }) {
  const [vals, setVals] = useState<Record<string, string>>(settings);
  const [saving, setSaving] = useState(false);
  const stats = (() => {
    try {
      const a = JSON.parse(vals.stats_config ?? "[]") as { value?: string; label?: string }[];
      return [0, 1, 2].map((i) => ({ value: a[i]?.value ?? "", label: a[i]?.label ?? "" }));
    } catch { return [{ value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }]; }
  })();
  const steps = (() => {
    try {
      const a = JSON.parse(vals.process_config ?? "[]") as { title?: string; desc?: string }[];
      return [0, 1, 2, 3].map((i) => ({ title: a[i]?.title ?? "", desc: a[i]?.desc ?? "" }));
    } catch {
      return [{ title: "", desc: "" }, { title: "", desc: "" }, { title: "", desc: "" }, { title: "", desc: "" }];
    }
  })();

  async function save() {
    setSaving(true);
    // Write ONLY the keys this tab edits. Writing the whole snapshot would
    // silently revert values changed in other tabs after this one mounted.
    const payload: Record<string, string> = {};
    for (const f of HERO_FIELDS) payload[f.key] = vals[f.key] ?? "";
    for (const g of HEADING_GROUPS) for (const key of g.fields) payload[key] = vals[key] ?? "";
    payload.stats_config = JSON.stringify(stats);
    payload.process_config = JSON.stringify(steps.map((s, i) => ({ n: String(i + 1).padStart(2, "0"), ...s })));
    for (const [key, value] of Object.entries(payload)) {
      const { error } = await sb.from("site_settings").upsert({ key, value }, { onConflict: "key" });
      if (error) { notify("err", `${key}: ${error.message}`); setSaving(false); return; }
    }
    setSaving(false);
    notify("ok", "Hero + headings saved ✓ — live on site");
    onChanged();
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div><h2 className="text-xl font-extrabold">Hero + Stats + Headings</h2>
        <p className="mt-1 text-sm text-zinc-500">Every headline on the homepage, plus the 3 stat cards and 4 process steps.</p></div>
      <Card><div className="space-y-4">
        {HERO_FIELDS.map((f) => (
          <Field key={f.key} label={f.label}>
            {"big" in f && f.big ? (
              <textarea value={vals[f.key] ?? ""} onChange={(e) => setVals({ ...vals, [f.key]: e.target.value })} rows={2} className={inputCls} />
            ) : (
              <input value={vals[f.key] ?? ""} onChange={(e) => setVals({ ...vals, [f.key]: e.target.value })} className={inputCls} />
            )}
          </Field>
        ))}
      </div></Card>
      <Card>
        <h3 className="font-extrabold">Stat cards (3)</h3>
        <div className="mt-3 grid sm:grid-cols-3 gap-3">
          {stats.map((st, i) => (
            <div key={i} className="space-y-2 rounded-2xl border border-white/10 bg-black/40 p-3">
              <input value={st.value} onChange={(e) => {
                const next = [...stats]; next[i] = { ...next[i], value: e.target.value };
                setVals({ ...vals, stats_config: JSON.stringify(next) });
              }} className={inputCls} placeholder="9" />
              <input value={st.label} onChange={(e) => {
                const next = [...stats]; next[i] = { ...next[i], label: e.target.value };
                setVals({ ...vals, stats_config: JSON.stringify(next) });
              }} className={inputCls} placeholder="Specialized Services" />
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="font-extrabold">Process steps (4)</h3>
        <div className="mt-3 space-y-3">
          {steps.map((st, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-black/40 p-3 space-y-2">
              <p className="text-xs font-black text-violet-300">Step {i + 1}</p>
              <input value={st.title} onChange={(e) => {
                const next = [...steps]; next[i] = { ...next[i], title: e.target.value };
                setVals({ ...vals, process_config: JSON.stringify(next.map((x, j) => ({ n: String(j + 1).padStart(2, "0"), ...x }))) });
              }} className={inputCls} placeholder="Step title" />
              <textarea value={st.desc} onChange={(e) => {
                const next = [...steps]; next[i] = { ...next[i], desc: e.target.value };
                setVals({ ...vals, process_config: JSON.stringify(next.map((x, j) => ({ n: String(j + 1).padStart(2, "0"), ...x }))) });
              }} rows={2} className={inputCls} placeholder="Step description" />
            </div>
          ))}
        </div>
      </Card>
      {HEADING_GROUPS.map((g) => (
        <Card key={g.title}>
          <h3 className="font-extrabold">{g.title}</h3>
          <div className="mt-3 space-y-3">
            {g.fields.map((k) => (
              <Field key={k} label={k.replace(/^sec_/, "").replace(/_/g, " ")}>
                <input value={vals[k] ?? ""} onChange={(e) => setVals({ ...vals, [k]: e.target.value })} className={inputCls} />
              </Field>
            ))}
          </div>
        </Card>
      ))}
      <button onClick={save} disabled={saving} className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-violet-300 disabled:opacity-50">
        {saving ? "Saving…" : "Save hero + headings"}
      </button>
    </div>
  );
}

/* ============================== services & cards workspace ============================== */
/* One workspace per service: words + sample cards (PNG upload) + 3 gallery tiles. */

const BLANK_WS_SAMPLE: Sample = { service_slug: "", title: "", description: "", client_name: "", image_url: "", embed_url: "", embed_type: "image", proof_metric: "", is_featured: false, order_index: 0, is_active: true };

function WorkspaceTab({ sb, services, samples, settings, details, onChanged, onDelete, notify }: TabProps & {
  services: Svc[]; samples: Sample[]; settings: Record<string, string>; details: Record<string, Record<string, unknown>>;
  onDelete: (t: string, id: string, label: string) => void;
}) {
  const [slug, setSlug] = useState(services[0]?.slug ?? "");
  const [adding, setAdding] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const list = [...services].sort((a, b) => a.order_index - b.order_index);
  const svc = list.find((s) => s.slug === slug) ?? list[0] ?? null;

  async function createService(e: React.FormEvent) {
    e.preventDefault();
    const clean = newSlug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    if (!clean || !newTitle.trim()) return notify("err", "Slug + title are required.");
    setCreating(true);
    const { error } = await sb.from("services").insert({
      slug: clean, title: newTitle.trim(), short_desc: "", long_desc: "",
      icon_emoji: "✦", accent_color: "#a78bfa", order_index: list.length + 1, is_active: true,
    });
    setCreating(false);
    if (error) notify("err", error.message);
    else {
      notify("ok", "Service added ✓");
      setNewSlug(""); setNewTitle(""); setAdding(false);
      setSlug(clean);
      onChanged();
    }
  }

  return (
    <div>
      <h2 className="text-xl font-extrabold">Services</h2>
      <p className="mt-1 text-sm text-zinc-500">Pick a service — edit its words, sample cards with PNG uploads, gallery tiles, and dedicated page, all in one place.</p>
      <div className="mt-4 grid items-start gap-5 lg:grid-cols-[260px_1fr]">
        <div className="space-y-2 lg:sticky lg:top-20">
          {adding ? (
            <form onSubmit={createService} className="space-y-2 rounded-2xl border border-dashed border-violet-400/40 p-3">
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className={inputCls} placeholder="Service title" />
              <input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} className={inputCls} placeholder="url-slug" />
              <div className="flex gap-2">
                <button disabled={creating} className="flex-1 rounded-xl bg-white px-3 py-2 text-xs font-bold text-black disabled:opacity-50">{creating ? "Adding…" : "Add"}</button>
                <button type="button" onClick={() => setAdding(false)} className="rounded-xl border border-white/15 px-3 py-2 text-xs">Cancel</button>
              </div>
            </form>
          ) : (
            <button onClick={() => setAdding(true)} className="w-full rounded-2xl border border-dashed border-violet-400/40 px-4 py-3 text-sm font-bold text-violet-200 hover:bg-violet-500/10">+ New service</button>
          )}
          {list.map((s) => {
            const n = samples.filter((r) => r.service_slug === s.slug).length;
            return (
              <button key={s.slug} onClick={() => setSlug(s.slug)} className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left ${svc?.slug === s.slug ? "border-violet-400/50 bg-violet-500/15" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"}`}>
                <span className="text-xl">{s.icon_emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{s.title}</span>
                  <span className="block text-[11px] text-zinc-500">{n} card{n === 1 ? "" : "s"}</span>
                </span>
              </button>
            );
          })}
        </div>
        {svc ? (
          <ServiceWorkspace key={svc.slug} sb={sb} service={svc} samples={samples} settings={settings} details={details} onChanged={onChanged} onDelete={onDelete} notify={notify} />
        ) : (
          <Card><p className="text-sm text-zinc-500">Add your first service to begin.</p></Card>
        )}
      </div>
    </div>
  );
}

function ServiceWorkspace({ sb, service, samples, settings, details, onChanged, onDelete, notify }: TabProps & {
  service: Svc; samples: Sample[]; settings: Record<string, string>; details: Record<string, Record<string, unknown>>;
  onDelete: (t: string, id: string, label: string) => void;
}) {
  const [texts, setTexts] = useState({
    title: service.title, short_desc: service.short_desc, long_desc: service.long_desc,
    icon_emoji: service.icon_emoji, accent_color: service.accent_color, is_active: service.is_active,
  });
  const [savingTexts, setSavingTexts] = useState(false);

  async function saveTexts(e: React.FormEvent) {
    e.preventDefault();
    if (!texts.title.trim()) return notify("err", "Title is required.");
    setSavingTexts(true);
    const { error } = await sb.from("services").update({
      title: texts.title.trim(), short_desc: texts.short_desc, long_desc: texts.long_desc,
      icon_emoji: texts.icon_emoji || "✦", accent_color: texts.accent_color || "#a78bfa",
      is_active: !!texts.is_active,
    }).eq("id", service.id);
    setSavingTexts(false);
    if (error) notify("err", error.message);
    else { notify("ok", "Words saved ✓ — live on site"); onChanged(); }
  }

  const mine = samples
    .filter((r) => r.service_slug === service.slug)
    .sort((a, b) => a.order_index - b.order_index);
  const [selSample, setSelSample] = useState<string | null>(
    mine.find((r) => r.is_featured)?.id ?? mine[0]?.id ?? null
  );
  const current = mine.find((r) => r.id === selSample) ?? null;

  const [slots, setSlots] = useState<Slot[]>(() => parseSlots(settings[`gallery:${service.slug}`]));
  const [savingGallery, setSavingGallery] = useState(false);

  async function saveGallery() {
    setSavingGallery(true);
    const { error } = await sb.from("site_settings").upsert(
      { key: `gallery:${service.slug}`, value: JSON.stringify(slots.map((x) => ({ title: x.title.trim(), url: x.url.trim(), kind: x.kind }))) },
      { onConflict: "key" }
    );
    setSavingGallery(false);
    if (error) notify("err", error.message);
    else { notify("ok", "Gallery saved ✓"); onChanged(); }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-3xl">{service.icon_emoji}</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-extrabold">{service.title}</h3>
          <p className="text-xs text-zinc-500">Words, cards & gallery for this service — everything in one place.</p>
        </div>
        <a href={`/#work-${service.slug}`} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold hover:bg-white/10">View section ↗</a>
      </div>

      {/* ① words */}
      <form onSubmit={saveTexts} className="space-y-3 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <h4 className="font-extrabold">① Words <span className="ml-1 text-xs font-normal text-zinc-500">card + section text</span></h4>
        <Field label="Title"><input value={texts.title} onChange={(e) => setTexts({ ...texts, title: e.target.value })} className={inputCls} /></Field>
        <Field label="Short text (service card)"><textarea value={texts.short_desc} onChange={(e) => setTexts({ ...texts, short_desc: e.target.value })} rows={2} className={inputCls} /></Field>
        <Field label="Long text (work section)"><textarea value={texts.long_desc} onChange={(e) => setTexts({ ...texts, long_desc: e.target.value })} rows={3} className={inputCls} /></Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Icon"><input value={texts.icon_emoji} onChange={(e) => setTexts({ ...texts, icon_emoji: e.target.value })} className={inputCls} /></Field>
          <Field label="Color"><input value={texts.accent_color} onChange={(e) => setTexts({ ...texts, accent_color: e.target.value })} className={inputCls} /></Field>
          <Field label="Order"><input type="number" value={service.order_index} disabled className={`${inputCls} opacity-50`} title="Order is managed by creation sequence" /></Field>
        </div>
        <RowToggle label="Show this service on site" value={texts.is_active} onChange={(v) => setTexts({ ...texts, is_active: v })} />
        <div className="flex flex-wrap gap-2">
          <button disabled={savingTexts} className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-violet-300 disabled:opacity-50">{savingTexts ? "Saving…" : "Save words"}</button>
          {service.id && <button type="button" onClick={() => onDelete("services", String(service.id), service.title)} className="rounded-xl border border-rose-400/40 px-5 py-2.5 text-sm text-rose-300">Delete service</button>}
        </div>
      </form>

      {/* ② sample cards */}
      <div className="rounded-3xl border border-violet-400/30 bg-violet-500/[0.07] p-5">
        <h4 className="font-extrabold">② Sample cards <span className="ml-1 text-xs font-normal text-zinc-500">title, text & PNG — incl. the main video ★</span></h4>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => setSelSample(null)} className={`rounded-full border px-4 py-2 text-xs font-bold ${selSample === null ? "border-violet-400/50 bg-violet-500/15" : "border-white/15 hover:bg-white/10"}`}>
            + New card
          </button>
          {mine.map((r) => (
            <button key={r.id} onClick={() => setSelSample(r.id ?? null)} className={`rounded-full border px-4 py-2 text-xs font-bold ${selSample === r.id ? "border-violet-400/50 bg-violet-500/15" : "border-white/15 hover:bg-white/10"}`}>
              {r.is_featured ? "★ " : ""}{r.title || "(untitled)"}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <SampleEditor key={current?.id ?? `new-${service.slug}`} sb={sb} serviceSlug={service.slug} initial={current} onChanged={onChanged} onDelete={onDelete} notify={notify} onSavedAs={(id) => setSelSample(id)} />
        </div>
      </div>

      {/* ③ gallery tiles */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <h4 className="font-extrabold">③ Gallery tiles <span className="ml-1 text-xs font-normal text-zinc-500">the 3 small tiles under the section</span></h4>
        <div className="mt-3 space-y-3">
          {slots.map((sl, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-black/40 p-3">
              <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Tile {i + 1}</p>
              <div className="mt-2 grid sm:grid-cols-[1fr_140px] gap-3">
                <Field label="Title"><input value={sl.title} onChange={(e) => setSlots((a) => a.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} className={inputCls} /></Field>
                <Field label="Type">
                  <select value={sl.kind} onChange={(e) => setSlots((a) => a.map((x, j) => (j === i ? { ...x, kind: e.target.value as Slot["kind"] } : x)))} className={inputCls}>
                    <option value="video">▶ Video</option>
                    <option value="image">🖼 Photo</option>
                    <option value="pdf">📄 PDF</option>
                  </select>
                </Field>
              </div>
              <div className="mt-2"><Field label="Link"><input value={sl.url} onChange={(e) => setSlots((a) => a.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} className={inputCls} placeholder="https://… (empty = Coming soon)" /></Field></div>
            </div>
          ))}
        </div>
        <button onClick={saveGallery} disabled={savingGallery} className="mt-3 rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-violet-300 disabled:opacity-50">
          {savingGallery ? "Saving…" : "Save gallery tiles"}
        </button>
      </div>

      {/* ④ dedicated page */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <h4 className="font-extrabold">④ Dedicated page <span className="ml-1 text-xs font-normal text-zinc-500">intro, benefits, FAQs & SEO for /services/{service.slug}</span></h4>
        <div className="mt-3">
          <ServicePageForm key={`page-${service.slug}`} sb={sb} service={service} details={details[service.slug] ?? null} onChanged={onChanged} notify={notify} />
        </div>
      </div>
    </div>
  );
}

function SampleEditor({ sb, serviceSlug, initial, onChanged, onDelete, notify, onSavedAs }: TabProps & {
  serviceSlug: string; initial: Sample | null;
  onDelete: (t: string, id: string, label: string) => void;
  onSavedAs: (id: string | null) => void;
}) {
  const [form, setForm] = useState<Sample>({ ...BLANK_WS_SAMPLE, service_slug: serviceSlug, ...(initial ?? {}) });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function onImage(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(sb, "portfolio-images", file);
      setForm((f) => ({ ...f, image_url: url }));
      notify("ok", "Image uploaded ✓ — save the card below");
    } catch (e: unknown) {
      notify("err", e instanceof Error ? e.message : "Upload failed");
    }
    setUploading(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return notify("err", "Give the card a title first.");
    setSaving(true);
    const payload = {
      service_slug: serviceSlug, title: form.title.trim(), description: form.description,
      client_name: form.client_name, image_url: form.image_url, embed_url: form.embed_url.trim(),
      embed_type: form.embed_type, proof_metric: form.proof_metric,
      is_featured: !!form.is_featured, order_index: Number(form.order_index) || 0, is_active: !!form.is_active,
    };
    let savedId: string | null = form.id ?? null;
    if (form.id) {
      const { error } = await sb.from("portfolio_items").update(payload).eq("id", form.id);
      if (error) { setSaving(false); notify("err", error.message); return; }
    } else {
      const { data, error } = await sb.from("portfolio_items").insert(payload).select("id").single();
      if (error) { setSaving(false); notify("err", error.message); return; }
      savedId = (data as { id: string } | null)?.id ?? null;
    }
    if (form.is_featured && savedId) {
      await sb.from("portfolio_items").update({ is_featured: false }).eq("service_slug", serviceSlug).neq("id", savedId);
    }
    setSaving(false);
    notify("ok", "Card saved ✓ — live on site");
    onSavedAs(savedId);
    onChanged();
  }

  return (
    <form onSubmit={save} className="space-y-3 rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Card title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="e.g. Documentary Edit" /></Field>
        <Field label="Type">
          <select value={form.embed_type} onChange={(e) => setForm({ ...form, embed_type: e.target.value })} className={inputCls}>
            <option value="image">🖼 Image (PNG/JPG upload)</option>
            <option value="youtube">▶ YouTube video</option>
            <option value="video">🎞 Video file link</option>
            <option value="website">🌐 Website</option>
          </select>
        </Field>
      </div>
      <Field label="Card text (description)"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={inputCls} placeholder="e.g. Hook + retention editing, animated captions…" /></Field>
      <Field label="Photo (PNG/JPG)">
        <div className="space-y-2">
          <UploadBtn label="↑ Upload PNG / JPG" uploading={uploading} onFile={onImage} />
          <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={inputCls} placeholder="https://… fills in after upload" />
          {form.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.image_url} alt="preview" className="max-h-40 rounded-xl border border-white/10" />
          )}
        </div>
      </Field>
      <Field label="Video / website link"><input value={form.embed_url} onChange={(e) => setForm({ ...form, embed_url: e.target.value })} className={inputCls} placeholder="https://…" /></Field>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Client name (optional)"><input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} className={inputCls} /></Field>
        <Field label="Order"><input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} className={inputCls} /></Field>
      </div>
      <RowToggle label="★ Main video (shows large)" value={!!form.is_featured} onChange={(v) => setForm({ ...form, is_featured: v })} />
      <RowToggle label="Show on site" value={!!form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} />
      <div className="flex flex-wrap gap-2">
        <button disabled={saving || uploading} className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-violet-300 disabled:opacity-50">{saving ? "Saving…" : initial ? "Save card" : "Add card"}</button>
        {initial?.id && <button type="button" onClick={() => { onSavedAs(null); onDelete("portfolio_items", String(initial.id), form.title); }} className="rounded-xl border border-rose-400/40 px-5 py-2.5 text-sm text-rose-300">Delete</button>}
      </div>
    </form>
  );
}

/* (Samples editor now lives inside the Services & Cards workspace above.) */

/* ============================== gallery slot helpers (used by the workspace) ============================== */

type Slot = { title: string; url: string; kind: "video" | "image" | "pdf" };

function parseSlots(raw: string | undefined): Slot[] {
  try {
    const a = JSON.parse(raw ?? "[]") as Partial<Slot>[];
    return [0, 1, 2].map((i) => ({
      title: typeof a[i]?.title === "string" ? (a[i]?.title as string) : "",
      url: typeof a[i]?.url === "string" ? (a[i]?.url as string) : "",
      kind: a[i]?.kind === "video" || a[i]?.kind === "pdf" ? (a[i]?.kind as Slot["kind"]) : "image",
    }));
  } catch {
    return [
      { title: "", url: "", kind: "image" },
      { title: "", url: "", kind: "image" },
      { title: "", url: "", kind: "image" },
    ];
  }
}

/* (Gallery editor now lives inside the Services & Cards workspace above.) */

/* ============================== reviews + faqs ============================== */

const BLANK_REVIEW: Review = { client_name: "", client_role: "", client_avatar_url: "", quote: "", rating: 5, order_index: 0, is_active: true };

function ReviewsTab({ sb, items, onChanged, onDelete, notify }: TabProps & { items: Review[]; onDelete: (t: string, id: string, label: string) => void }) {
  const [sel, setSel] = useState<string | null>(null);
  const [form, setForm] = useState<Review>(BLANK_REVIEW);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const list = [...items].sort((a, b) => a.order_index - b.order_index);

  function pick(r: Review | null) {
    setSel(r?.id ?? null);
    setForm(r ? { ...r } : { ...BLANK_REVIEW, order_index: list.length + 1 });
  }

  async function onAvatar(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(sb, "site-assets", file);
      setForm((f) => ({ ...f, client_avatar_url: url }));
      notify("ok", "Photo uploaded ✓");
    } catch (e: unknown) {
      notify("err", e instanceof Error ? e.message : "Upload failed");
    }
    setUploading(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.client_name.trim() || !form.quote.trim()) return notify("err", "Name + quote are required.");
    setSaving(true);
    const payload = { ...form, rating: Number(form.rating) || 5, order_index: Number(form.order_index) || 0 };
    const { error } = sel
      ? await sb.from("testimonials").update(payload).eq("id", sel)
      : await sb.from("testimonials").insert(payload);
    setSaving(false);
    if (error) notify("err", error.message);
    else { notify("ok", "Review saved ✓"); pick(null); onChanged(); }
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-extrabold">Reviews</h2>
      <p className="mt-1 text-sm text-zinc-500">Only add real client quotes you have permission to publish.</p>
      <div className="mt-4 space-y-2">
        <button onClick={() => pick(null)} className="w-full rounded-2xl border border-dashed border-violet-400/40 px-4 py-3 text-sm font-bold text-violet-200 hover:bg-violet-500/10">+ New review</button>
        {list.map((r) => (
          <div key={r.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
            <button onClick={() => pick(r)} className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm font-bold">{r.client_name} ★{r.rating}</span>
              <span className="block truncate text-[11px] text-zinc-500">{r.quote}</span>
            </button>
            <button onClick={() => r.id && onDelete("testimonials", r.id, r.client_name)} className="shrink-0 rounded-full border border-rose-400/40 px-3 py-1.5 text-xs text-rose-300">Del</button>
          </div>
        ))}
      </div>
      <form onSubmit={save} className="mt-4 space-y-3 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <h3 className="font-extrabold">{sel ? "Edit review" : "New review"}</h3>
        <Field label="Quote"><textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={3} className={inputCls} /></Field>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Client name"><input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} className={inputCls} /></Field>
          <Field label="Role / company"><input value={form.client_role} onChange={(e) => setForm({ ...form, client_role: e.target.value })} className={inputCls} /></Field>
          <Field label="Rating (1-5)"><input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className={inputCls} /></Field>
        </div>
        <Field label="Client photo (optional)">
          <div className="space-y-2">
            <UploadBtn label="↑ Upload photo" uploading={uploading} onFile={onAvatar} />
            <input value={form.client_avatar_url} onChange={(e) => setForm({ ...form, client_avatar_url: e.target.value })} className={inputCls} placeholder="https://…" />
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Order"><input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} className={inputCls} /></Field>
          <div className="flex items-end pb-1"><RowToggle label="Show" value={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} /></div>
        </div>
        <button disabled={saving || uploading} className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-violet-300 disabled:opacity-50">{saving ? "Saving…" : sel ? "Save review" : "Add review"}</button>
      </form>
    </div>
  );
}

const BLANK_FAQ: FaqRow = { question: "", answer: "", order_index: 0, is_active: true };

function FaqsTab({ sb, items, onChanged, onDelete, notify }: TabProps & { items: FaqRow[]; onDelete: (t: string, id: string, label: string) => void }) {
  const [sel, setSel] = useState<string | null>(null);
  const [form, setForm] = useState<FaqRow>(BLANK_FAQ);
  const [saving, setSaving] = useState(false);
  const list = [...items].sort((a, b) => a.order_index - b.order_index);

  function pick(r: FaqRow | null) {
    setSel(r?.id ?? null);
    setForm(r ? { ...r } : { ...BLANK_FAQ, order_index: list.length + 1 });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) return notify("err", "Question + answer are required.");
    setSaving(true);
    const payload = { ...form, order_index: Number(form.order_index) || 0 };
    const { error } = sel
      ? await sb.from("faqs").update(payload).eq("id", sel)
      : await sb.from("faqs").insert(payload);
    setSaving(false);
    if (error) notify("err", error.message);
    else { notify("ok", "FAQ saved ✓"); pick(null); onChanged(); }
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-extrabold">FAQs</h2>
      <p className="mt-1 text-sm text-zinc-500">Homepage accordion + FAQ schema update together.</p>
      <div className="mt-4 space-y-2">
        <button onClick={() => pick(null)} className="w-full rounded-2xl border border-dashed border-violet-400/40 px-4 py-3 text-sm font-bold text-violet-200 hover:bg-violet-500/10">+ New FAQ</button>
        {list.map((r) => (
          <div key={r.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
            <button onClick={() => pick(r)} className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm font-bold">{r.question}</span>
            </button>
            <button onClick={() => r.id && onDelete("faqs", r.id, r.question)} className="shrink-0 rounded-full border border-rose-400/40 px-3 py-1.5 text-xs text-rose-300">Del</button>
          </div>
        ))}
      </div>
      <form onSubmit={save} className="mt-4 space-y-3 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <h3 className="font-extrabold">{sel ? "Edit FAQ" : "New FAQ"}</h3>
        <Field label="Question"><input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className={inputCls} /></Field>
        <Field label="Answer"><textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={3} className={inputCls} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Order"><input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} className={inputCls} /></Field>
          <div className="flex items-end pb-1"><RowToggle label="Show" value={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} /></div>
        </div>
        <button disabled={saving} className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-violet-300 disabled:opacity-50">{saving ? "Saving…" : sel ? "Save FAQ" : "Add FAQ"}</button>
      </form>
    </div>
  );
}

/* ============================== service dedicated pages ============================== */

type PageForm = { intro: string; benefits: string; deliverables: string; ideal_for: string; meta_title: string; meta_desc: string; faqs: { q: string; a: string }[] };

function formFromDetails(d: Record<string, unknown> | null): PageForm {
  const lines = (v: unknown) => (Array.isArray(v) ? (v as string[]).join("\n") : "");
  return {
    intro: String(d?.intro ?? ""),
    benefits: lines(d?.benefits),
    deliverables: lines(d?.deliverables),
    ideal_for: lines(d?.ideal_for),
    meta_title: String(d?.meta_title ?? ""),
    meta_desc: String(d?.meta_desc ?? ""),
    faqs: Array.isArray(d?.faqs) ? (d?.faqs as { q: string; a: string }[]) : [],
  };
}

function ServicePageForm({ sb, service, details, onChanged, notify }: TabProps & { service: Svc; details: Record<string, unknown> | null }) {
  const [form, setForm] = useState<PageForm>(() => formFromDetails(details));
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const split = (t: string) => t.split("\n").map((x) => x.trim()).filter(Boolean);
    const { error } = await sb.from("service_details").upsert({
      service_slug: service.slug,
      intro: form.intro,
      benefits: split(form.benefits),
      deliverables: split(form.deliverables),
      ideal_for: split(form.ideal_for),
      faqs: form.faqs.filter((f) => f.q.trim() && f.a.trim()),
      meta_title: form.meta_title,
      meta_desc: form.meta_desc,
    }, { onConflict: "service_slug" });
    setSaving(false);
    if (error) notify("err", error.message);
    else { notify("ok", `${service.title} page saved ✓`); onChanged(); }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <Field label="Intro paragraph"><textarea value={form.intro} onChange={(e) => setForm({ ...form, intro: e.target.value })} rows={3} className={inputCls} /></Field>
        <Field label="Benefits (one per line)"><textarea value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} rows={4} className={inputCls} /></Field>
        <Field label="Deliverables (one per line)"><textarea value={form.deliverables} onChange={(e) => setForm({ ...form, deliverables: e.target.value })} rows={5} className={inputCls} /></Field>
        <Field label="Who it's for (one per line)"><textarea value={form.ideal_for} onChange={(e) => setForm({ ...form, ideal_for: e.target.value })} rows={3} className={inputCls} /></Field>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="SEO title"><input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} className={inputCls} /></Field>
          <Field label="SEO description"><textarea value={form.meta_desc} onChange={(e) => setForm({ ...form, meta_desc: e.target.value })} rows={2} className={inputCls} /></Field>
        </div>
      </div>
      <div>
        <h5 className="font-extrabold text-sm">Page FAQs</h5>
        <div className="mt-2 space-y-3">
          {form.faqs.map((f, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-black/40 p-3 space-y-2">
              <input value={f.q} onChange={(e) => setForm({ ...form, faqs: form.faqs.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)) })} className={inputCls} placeholder="Question" />
              <textarea value={f.a} onChange={(e) => setForm({ ...form, faqs: form.faqs.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)) })} rows={2} className={inputCls} placeholder="Answer" />
              <button onClick={() => setForm({ ...form, faqs: form.faqs.filter((_, j) => j !== i) })} className="text-xs text-rose-300 hover:text-rose-200">Remove</button>
            </div>
          ))}
          <button onClick={() => setForm({ ...form, faqs: [...form.faqs, { q: "", a: "" }] })} className="w-full rounded-2xl border border-dashed border-white/15 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5">+ Add FAQ</button>
        </div>
      </div>
      <button onClick={save} disabled={saving} className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-violet-300 disabled:opacity-50">
        {saving ? "Saving…" : `Save ${service.title} page`}
      </button>
    </div>
  );
}
