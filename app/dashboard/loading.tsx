export default function DashboardLoading() {
  return (
    <main className="mx-auto max-w-6xl p-4 md:p-8" role="status" aria-label="Loading">
      <div className="h-4 w-36 animate-pulse rounded-full bg-[var(--bg-elevated)]" />
      <div className="mt-3 h-9 w-80 max-w-full animate-pulse rounded-xl bg-[var(--bg-elevated)]" />
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-36 animate-pulse rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)]" />
        ))}
      </div>
      <div className="mt-5 h-64 animate-pulse rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)]" />
    </main>
  );
}
