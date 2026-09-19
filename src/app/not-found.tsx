import Link from "next/link";
import { SITE } from "@/lib/site";

export default function NotFound() {
  return (
    <main
      className="text-zinc-100 min-h-screen grid place-items-center px-5"
      style={{ background: "var(--color-bg, #060606)" }}
    >
      <div className="text-center max-w-md">
        <p className="text-xs uppercase tracking-[0.2em] text-violet-300 font-bold">404</p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight">
          Page not found
        </h1>
        <p className="mt-4 text-zinc-400">
          The page you are looking for doesn&apos;t exist or was moved.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/"
            className="px-7 py-3.5 rounded-full bg-white text-black text-sm font-bold hover:bg-violet-300"
          >
            Back to home
          </Link>
          <a
            href={SITE.calendlyUrl}
            target="_blank"
            rel="noreferrer"
            className="px-7 py-3.5 rounded-full border border-white/15 text-sm font-semibold hover:bg-white/10"
          >
            Book a Free Strategy Call ↗
          </a>
        </div>
      </div>
    </main>
  );
}
