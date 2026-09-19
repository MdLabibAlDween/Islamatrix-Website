"use client";
import { useEffect, useState } from "react";

/** Floating button that appears after scrolling down — one tap scrolls back to top. */
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      title="Back to top"
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 grid h-11 w-11 place-items-center rounded-full bg-white text-lg font-bold text-black shadow-2xl transition-transform duration-200 hover:scale-105 hover:bg-violet-300 active:scale-95"
    >
      ↑
    </button>
  );
}
