"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ calendlyUrl, agencyName, logoUrl, hideSamples }: { calendlyUrl: string; agencyName: string; logoUrl?: string; hideSamples?: boolean }) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [active, setActive] = useState("");
  // Section links only make sense on the homepage — everywhere else
  // the navbar offers a way back home instead.
  const isHome = usePathname() === "/";
  const allLinks: [string, string][] = [
    ["Services", "/#services"],
    ["Pricing", "/#pricing"],
    ["Samples", "/#work"],
    ["How We Work", "/#team"],
    ["FAQ", "/#faq"],
    ["About Me", "/about"],
    ["Contact", "/#book"],
  ];
  // No-samples mode: drop the Samples menu item (its section is hidden).
  const links = hideSamples ? allLinks.filter(([, href]) => href !== "/#work") : allLinks;

  // Turn the pill solid dark as soon as the hero scrolls out from under it.
  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero || !("IntersectionObserver" in window)) {
      const onScroll = () => setDark(window.scrollY > 480);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }
    const obs = new IntersectionObserver(([entry]) => setDark(!entry.isIntersecting), {
      rootMargin: "-72px 0px 0px 0px",
    });
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  // Scrollspy: highlight the menu link for the section currently on screen.
  useEffect(() => {
    const ids = links.map(([, href]) => href.split("#")[1]);
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.35;
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= y) current = `/#${id}`;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <header className="fixed inset-x-4 top-4 md:top-6 z-50 nav-drop">
      <div className={`mx-auto w-full md:w-max rounded-full px-4 py-3 sm:px-6 md:px-8 flex items-center justify-between gap-2 md:justify-start md:gap-8 transition-all duration-500 ${dark ? "bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.65)]" : "glass shadow-[0_0_40px_rgba(167,139,250,0.12)]"}`}>
        <Link href="/#top" className="flex shrink-0 items-center gap-2" aria-label="Home">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={`${agencyName} logo`} className="h-10 sm:h-11 md:h-12 w-auto max-w-[200px] sm:max-w-[240px] object-contain" />
          ) : (
            <span className="font-bold tracking-tight">{agencyName}</span>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {isHome ? (
            links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                aria-current={active === href ? "true" : undefined}
                className={`whitespace-nowrap px-4 py-2 text-xs font-medium uppercase tracking-wide rounded-full transition-all duration-300 ${active === href ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"}`}
              >
                {label}
              </a>
            ))
          ) : (
            <Link
              href="/"
              className="whitespace-nowrap px-4 py-2 text-xs font-medium uppercase tracking-wide rounded-full transition-all duration-300 text-zinc-400 hover:text-white"
            >
              ← Back to Home
            </Link>
          )}
        </nav>

        <div className="hidden shrink-0 md:block">
          <a href={calendlyUrl} target="_blank" rel="noreferrer" className="inline-block px-5 py-2.5 text-sm font-bold rounded-full bg-white text-black transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]">
            Book Call ↗
          </a>
        </div>

        {isHome ? (
          <button type="button" onClick={() => setOpen((v) => !v)} className="flex shrink-0 p-2 text-white md:hidden" aria-label="Toggle menu" aria-expanded={open}>
            <span className="relative flex h-5 w-6 items-center justify-center">
              <span className={`absolute h-0.5 w-full bg-white transition-all duration-300 ${open ? "rotate-45" : "-translate-y-[7px]"}`} />
              <span className={`absolute h-0.5 w-full bg-white transition-all duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`absolute h-0.5 w-full bg-white transition-all duration-300 ${open ? "-rotate-45" : "translate-y-[7px]"}`} />
            </span>
          </button>
        ) : (
          <Link href="/" className="shrink-0 px-3 py-2 text-xs font-medium uppercase tracking-wide text-zinc-300 md:hidden">
            ← Home
          </Link>
        )}
      </div>

      {open && isHome && (
        <div className="md:hidden mx-auto mt-2 w-full rounded-3xl bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/15 p-3 shadow-2xl">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className={`block rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${active === href ? "bg-white/10 text-white" : "text-zinc-300 hover:bg-white/10 hover:text-white"}`}>
              {label}
            </a>
          ))}
          <a href={calendlyUrl} target="_blank" rel="noreferrer" className="mt-2 block rounded-2xl bg-white px-4 py-3 text-center text-sm font-bold text-black">
            Book Call ↗
          </a>
        </div>
      )}
    </header>
  );
}
