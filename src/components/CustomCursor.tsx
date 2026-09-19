"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

const emptySubscribe = () => () => {};

/** Custom site-wide cursor: a small badge with "LN" in cursive, following the mouse. */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  // Server snapshot (false) matches first client render — no hydration mismatch.
  const enabled = useSyncExternalStore(
    emptySubscribe,
    () => window.matchMedia("(pointer: fine)").matches,
    () => false
  );
  const [hot, setHot] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: MouseEvent) => {
      dot.current?.style.setProperty("transform", `translate(${e.clientX}px, ${e.clientY}px)`);
      const t = e.target as HTMLElement | null;
      setHot(!!t?.closest("a, button, input, textarea, select, [role='tab']"));
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [enabled]);

  if (!enabled) return null;
  // Disabled in the admin area — it uses the native cursor instead.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[200]">
      <div ref={dot} className="will-change-transform">
        <div
          className={`-ml-5 -mt-5 grid h-10 w-10 place-items-center rounded-full border border-violet-300/50 bg-black/60 text-sm text-white shadow-[0_0_20px_rgba(167,139,250,0.35)] backdrop-blur-sm transition-transform duration-200 ${hot ? "scale-150" : ""}`}
        >
          <span style={{ fontFamily: "'Brush Script MT', 'Segoe Script', 'Comic Sans MS', cursive" }}>
            LN
          </span>
        </div>
      </div>
    </div>
  );
}
