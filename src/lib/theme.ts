/* Hardcoded design theme (previously stored in site_settings — now static).
   Keys: theme_preset, color_primary, color_secondary, color_accent, color_bg,
         radius_card, radius_btn, glow, font_heading, font_body */

export type ThemePresetId = "midnight" | "cyber" | "noir" | "neon" | "custom";

export type ThemePreset = {
  id: ThemePresetId;
  name: string;
  blurb: string;
  swatches: [string, string, string];
  values: Record<string, string>;
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "midnight",
    name: "Midnight Purple",
    blurb: "Signature dark + purple look",
    swatches: ["#a78bfa", "#f43f5e", "#22d3ee"],
    values: {
      color_primary: "#a78bfa", color_secondary: "#f43f5e", color_accent: "#22d3ee",
      color_bg: "#060606", radius_card: "32", radius_btn: "999", glow: "70",
      font_heading: "default", font_body: "default",
    },
  },
  {
    id: "cyber",
    name: "Cyber Blue",
    blurb: "Cool tech glow",
    swatches: ["#22d3ee", "#60a5fa", "#a78bfa"],
    values: {
      color_primary: "#22d3ee", color_secondary: "#60a5fa", color_accent: "#a78bfa",
      color_bg: "#03070a", radius_card: "24", radius_btn: "999", glow: "85",
      font_heading: "default", font_body: "default",
    },
  },
  {
    id: "noir",
    name: "Premium Black",
    blurb: "Quiet luxury, monochrome",
    swatches: ["#f5f5f5", "#a1a1aa", "#a78bfa"],
    values: {
      color_primary: "#f5f5f5", color_secondary: "#a1a1aa", color_accent: "#a78bfa",
      color_bg: "#050505", radius_card: "20", radius_btn: "14", glow: "25",
      font_heading: "serif", font_body: "default",
    },
  },
  {
    id: "neon",
    name: "Creative Neon",
    blurb: "Loud magenta + cyan",
    swatches: ["#f0f", "#0ff", "#a78bfa"],
    values: {
      color_primary: "#e879f9", color_secondary: "#22d3ee", color_accent: "#a78bfa",
      color_bg: "#08060c", radius_card: "28", radius_btn: "999", glow: "100",
      font_heading: "default", font_body: "default",
    },
  },
];

export const FONT_STACKS: Record<string, string> = {
  default: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  mono: "ui-monospace, 'SF Mono', Menlo, monospace",
};

export const THEME_DEFAULTS: Record<string, string> = THEME_PRESETS[0].values;

export function themeFromSettings(settings: Record<string, string>): Record<string, string> {
  const t: Record<string, string> = { ...THEME_DEFAULTS };
  for (const k of Object.keys(THEME_DEFAULTS)) {
    if (settings[k] && settings[k].trim() !== "") t[k] = settings[k];
  }
  return t;
}

/** Rendered into <style> in the root layout — the whole site follows these vars. */
export function themeCssVars(t: Record<string, string>): string {
  const num = (v: string | undefined, fb: number) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fb;
  };
  const glow = num(t.glow, 70) / 100;
  return [
    `--color-primary:${t.color_primary}`,
    `--color-secondary:${t.color_secondary}`,
    `--color-accent:${t.color_accent}`,
    `--color-bg:${t.color_bg}`,
    `--radius-card:${num(t.radius_card, 32)}px`,
    `--radius-btn:${num(t.radius_btn, 999)}px`,
    `--glow:${glow}`,
    `--font-heading:${FONT_STACKS[t.font_heading] ?? FONT_STACKS.default}`,
    `--font-body:${FONT_STACKS[t.font_body] ?? FONT_STACKS.default}`,
  ].join(";");
}

/* ---------- sections manager (also settings-driven, no DDL) ---------- */

export type SectionKey = "hero" | "services" | "featured" | "work" | "process" | "team" | "testimonials" | "faq" | "booking";

export const SECTIONS_DEFAULT: { key: SectionKey; title: string; desc: string }[] = [
  { key: "hero", title: "Hero", desc: "Banner, headline, buttons, stats" },
  { key: "services", title: "Services grid", desc: "The 9 cards" },
  { key: "featured", title: "Featured spotlight", desc: "Large editorial service feature" },
  { key: "work", title: "Work sections", desc: "9 proof galleries" },
  { key: "process", title: "Process timeline", desc: "How working together goes" },
  { key: "team", title: "Team", desc: "Managers + agency" },
  { key: "testimonials", title: "Reviews", desc: "Client quotes" },
  { key: "faq", title: "FAQ", desc: "Questions + answers" },
  { key: "booking", title: "Booking + footer", desc: "Calendly, contact, copyright" },
];

export type SectionCfg = { key: SectionKey; visible: boolean };

export function parseSections(raw: string | undefined): SectionCfg[] {
  let arr: unknown[] = [];
  if (raw) {
    try {
      const p: unknown = JSON.parse(raw);
      if (Array.isArray(p)) arr = p;
    } catch { arr = []; }
  }
  const byKey = new Map<string, boolean>();
  for (const s of arr) {
    const o = s as Partial<SectionCfg>;
    if (o && typeof o.key === "string") byKey.set(o.key, o.visible !== false);
  }
  // Order follows stored array first, then any missing defaults appended visible.
  const out: SectionCfg[] = [];
  for (const s of arr) {
    const o = s as Partial<SectionCfg>;
    if (o && typeof o.key === "string" && SECTIONS_DEFAULT.some((d) => d.key === o.key) && !out.some((x) => x.key === o.key)) {
      out.push({ key: o.key as SectionKey, visible: o.visible !== false });
    }
  }
  for (const d of SECTIONS_DEFAULT) {
    if (!out.some((x) => x.key === d.key)) out.push({ key: d.key, visible: byKey.get(d.key) !== false });
  }
  return out;
}
