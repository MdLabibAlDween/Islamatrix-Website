import SectionHead from "./SectionHead";
import GradientTitle from "./Title";
import Reveal from "./Reveal";

// No names appear in this section. One merged card presents the agency
// promise; individual managers are listed ONLY on the About page.
export default function TeamGrid({ eyebrow, title, highlight, sub, cardTitle, cardText, tagline }: {
  eyebrow?: string;
  title?: string;
  highlight?: string;
  sub?: string;
  cardTitle?: string;
  cardText?: string;
  tagline?: string;
}) {
  return (
    <section id="team" className="px-5 py-16 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <SectionHead
          eyebrow={eyebrow ?? "How we work"}
          title={<GradientTitle title={title ?? "Every Work Managed for You, All in One Place."} highlight={highlight ?? "All in One Place."} />}
          sub={sub ?? "You share your goal once — our agency plans, executes, and delivers everything for you, with a single point of contact from start to finish."}
        />

        <Reveal className="mt-10">
          <div className="relative mx-auto max-w-4xl">
            <div className="absolute -inset-8 pointer-events-none" aria-hidden="true">
              <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[440px] h-[240px] bg-violet-600/20 blur-[110px] rounded-full" />
              <div className="absolute right-0 bottom-0 w-[220px] h-[160px] bg-rose-600/10 blur-[90px] rounded-full" />
            </div>

            <div className="relative glass glow-border rounded-[2rem] p-7 sm:p-10 overflow-hidden text-center">
              <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" aria-hidden="true" />
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-300">Managed for you · All in one place</p>
              <p className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight">{cardTitle ?? "Every Service, Handled Under One Roof"}</p>
              <p className="mt-2.5 text-sm sm:text-[15px] text-zinc-300 leading-relaxed max-w-2xl mx-auto">
                {cardText ?? "Our agency manages every work for you, all in one place. Share your goal once with one of our managers, and we plan the work, handle everything behind the scenes, and deliver the finished result to you."}
              </p>
              {tagline && (
                <p className="mt-4 text-sm sm:text-base font-bold text-white max-w-2xl mx-auto">
                  {tagline}
                </p>
              )}
              <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs sm:text-sm text-zinc-200">
                <span className="inline-flex items-center gap-1.5"><span className="text-emerald-300 font-bold">✓</span> One point of contact</span>
                <span className="inline-flex items-center gap-1.5"><span className="text-emerald-300 font-bold">✓</span> Every service under one roof</span>
                <span className="inline-flex items-center gap-1.5"><span className="text-emerald-300 font-bold">✓</span> Delivered end-to-end</span>
              </div>
              <div className="mt-7 flex flex-wrap justify-center gap-2.5 text-sm">
                <a href="#book" className="px-6 py-3 rounded-full bg-white text-black font-bold hover:bg-violet-300 transition-colors">Book a Free Strategy Call ↗</a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
