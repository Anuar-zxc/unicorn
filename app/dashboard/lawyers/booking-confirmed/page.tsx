import Link from "next/link";
import { CalendarPlus, CheckCircle2, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function BookingConfirmedPage({
  searchParams
}: {
  searchParams: Promise<{ lawyer?: string; slot?: string; demo?: string }>;
}) {
  const params = await searchParams;
  const lawyer = params.lawyer ?? "your lawyer";
  const slot = params.slot ?? "selected time";

  return (
    <main className="grid min-h-[calc(100vh-64px)] place-items-center p-4 md:p-6">
      <section className="w-full max-w-xl rounded-2xl border border-[#252528] bg-[#141418] p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold">Booking confirmed</h1>
        <p className="mt-3 text-sm leading-6 text-white/55">
          Your consultation with <span className="font-semibold text-white">{lawyer}</span> is reserved for <span className="font-semibold text-white">{slot}</span>.
        </p>
        {params.demo && (
          <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-100">
            Demo confirmation shown because Stripe keys are not configured yet.
          </p>
        )}
        <p className="mt-5 rounded-xl border border-[#252528] bg-[#0C0C0E] p-4 text-sm leading-6 text-white/55">
          If you attached a Lexo case brief, it will be shared with the lawyer before the call so they can come prepared.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button variant="outline">
            <CalendarPlus className="h-4 w-4" />
            Add to calendar
          </Button>
          <Link href="/dashboard">
            <Button className="w-full">
              <LayoutDashboard className="h-4 w-4" />
              Back to dashboard
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
