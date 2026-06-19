export default function DashboardLoading() {
  return (
    <main className="animate-pulse p-4 md:p-6">
      <div className="h-4 w-36 rounded bg-white/10" />
      <div className="mt-3 h-9 w-72 max-w-full rounded bg-white/10" />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-36 rounded-2xl border border-[#252b36] bg-[#131720]"
          />
        ))}
      </div>
      <div className="mt-5 h-64 rounded-2xl border border-[#252b36] bg-[#131720]" />
    </main>
  );
}
