import { lawyers } from "@/lib/data";
import { Avatar } from "@/components/shared/Avatar";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/ui/button";

export function LawyerPreview() {
  return (
    <section id="lawyers" className="py-20 md:py-28">
      <div className="container-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-caption text-[#1A56E8]">Lawyer marketplace</p>
          <h2 className="text-h2 mt-3">When AI is not enough, real lawyers are one click away.</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {lawyers.map((lawyer) => (
            <article key={lawyer.name} className="rounded-[8px] border border-[var(--border-token)] bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-deep">
              <div className="flex items-start gap-4">
                <Avatar initials={lawyer.initials} tone={lawyer.tone} className="h-14 w-14" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-semibold">{lawyer.name}</h3>
                    <Badge tone="green">Verified</Badge>
                  </div>
                  <p className="mt-1 text-sm text-[#4A4A48]">{lawyer.specialty}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {lawyer.tags.slice(0, 3).map((tag) => <Badge key={tag}>{tag}</Badge>)}
              </div>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="font-semibold">★ {lawyer.rating}</span>
                <span className="text-[#4A4A48]">${lawyer.price}/session</span>
              </div>
              <Button className="mt-5 w-full">Book 30-min call</Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
