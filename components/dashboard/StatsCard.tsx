export function StatsCard({
  label,
  value,
  detail
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-lg border border-[#252528] bg-[#141418] p-5">
      <p className="text-sm text-white/50">{label}</p>
      <p className="mt-3 font-display text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-white/42">{detail}</p>
    </article>
  );
}
