export default function SectionHead({ eyebrow, title, sub }: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-violet-300 font-bold">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-tight">{title}</h2>
      {sub && <p className="mt-3 text-zinc-400">{sub}</p>}
    </div>
  );
}
