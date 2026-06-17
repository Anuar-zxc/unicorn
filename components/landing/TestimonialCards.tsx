import { testimonials } from "@/lib/data";
import { Avatar } from "@/components/shared/Avatar";

export function TestimonialCards() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-shell">
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-[8px] border border-[var(--border-token)] bg-white p-6 shadow-soft">
              <p className="text-[#1A56E8]">★★★★★</p>
              <blockquote className="mt-5 text-lg leading-8">"{item.quote}"</blockquote>
              <div className="mt-6 flex items-center gap-3">
                <Avatar initials={item.initials} className="h-11 w-11" />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-[#4A4A48]">{item.company}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
