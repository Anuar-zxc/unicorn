import { Star, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const lawyers = [
  ["Maya Chen", "Employment Law · California", "Handled 18+ cases like yours", "$89 / 30-min", "4.9"],
  ["Daniel Hart", "Business Disputes · New York", "Breach-of-contract and collections", "$99 / 30-min", "4.8"],
  ["Elena Volkova", "EU Contract Law · GDPR", "Cross-border SMB counsel", "$89 / 30-min", "4.9"],
  ["Aisha Rahman", "Startup Contracts · UK", "SaaS, NDAs, founder disputes", "$79 / 30-min", "4.7"]
];

export default function LawyersPage() {
  return (
    <main className="p-4 md:p-6">
      <div className="mb-6">
        <p className="text-sm text-white/42">Human handoff</p>
        <h1 className="font-display text-3xl font-semibold">Find a Lawyer</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
          Match with verified lawyers for flat-fee consultations. Your Lexo brief can be shared before the call so they arrive prepared.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {lawyers.map(([name, specialty, proof, price, rating]) => (
          <article key={name} className="card rounded-2xl border border-[#252528] bg-[#141418] p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4D7EF5] font-bold text-white">
                {name.split(" ").map((part) => part[0]).join("")}
              </div>
              <div>
                <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                  {name}
                  <BadgeCheck className="h-4 w-4 text-emerald-300" />
                </h2>
                <p className="mt-1 text-sm text-white/50">{specialty}</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-white/62">{proof}</p>
            <div className="mt-5 flex items-center justify-between">
              <p className="flex items-center gap-1 text-sm text-amber-200"><Star className="h-4 w-4 fill-amber-200" />{rating}</p>
              <p className="font-semibold">{price}</p>
            </div>
            <Button className="mt-5 w-full">Book consultation</Button>
          </article>
        ))}
      </div>
    </main>
  );
}
