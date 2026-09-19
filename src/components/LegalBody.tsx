import type { ReactNode } from "react";

export type LegalSection = { heading: string; paragraphs: string[] };

/**
 * Parse admin-editable legal text (site_settings privacy_body / terms_body).
 * - A line starting with "## " begins a new section with that heading.
 * - Blank lines split paragraphs.
 * - "{{email}}" inside a paragraph renders as a mailto link (see LegalBody).
 */
export function parseLegalBody(raw: string): LegalSection[] {
  const sections: LegalSection[] = [];
  let current: LegalSection = { heading: "", paragraphs: [] };
  let buf: string[] = [];
  const flush = () => {
    const text = buf.join(" ").trim();
    buf = [];
    if (text) current.paragraphs.push(text);
  };
  for (const line of (raw ?? "").split(/\r?\n/)) {
    const t = line.trim();
    if (t.startsWith("## ")) {
      flush();
      if (current.heading || current.paragraphs.length) sections.push(current);
      current = { heading: t.slice(3).trim(), paragraphs: [] };
    } else if (!t) {
      flush();
    } else {
      buf.push(t);
    }
  }
  flush();
  if (current.heading || current.paragraphs.length) sections.push(current);
  return sections;
}

function renderInline(text: string, email: string): ReactNode {
  const parts = text.split("{{email}}");
  if (parts.length === 1) return text;
  const out: ReactNode[] = [];
  parts.forEach((part, i) => {
    if (part) out.push(<span key={`t${i}`}>{part}</span>);
    if (i < parts.length - 1) {
      out.push(
        <a key={`e${i}`} href={`mailto:${email}`} className="text-violet-300 underline">
          {email}
        </a>
      );
    }
  });
  return <>{out}</>;
}

/** Server-rendered legal article: section headings + paragraphs with email links. */
export default function LegalBody({ body, email }: { body: string; email: string }) {
  const sections = parseLegalBody(body);
  if (!sections.length) return null;
  return (
    <div className="mt-8 space-y-6 text-sm sm:text-base text-zinc-300 leading-relaxed">
      {sections.map((s, i) => (
        <section key={i}>
          {s.heading && <h2 className="text-lg font-extrabold text-white">{s.heading}</h2>}
          {s.paragraphs.map((p, j) => (
            <p key={j} className={s.heading || j > 0 ? "mt-2" : ""}>
              {renderInline(p, email)}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
