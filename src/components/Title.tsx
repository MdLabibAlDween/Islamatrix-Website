/** Heading with a gradient highlight slice — DB-driven titles stay styled. */
export default function GradientTitle({
  title,
  highlight,
}: {
  title: string;
  highlight: string;
}) {
  if (!highlight || !title.includes(highlight)) return <>{title}</>;
  const parts = title.split(highlight);
  return (
    <>
      {parts[0]} <span className="text-gradient">{highlight}</span>{" "}
      {parts.slice(1).join(highlight)}
    </>
  );
}
