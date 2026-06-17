import { features } from "@/lib/data";

export function FeaturesGrid() {
  return (
    <section id="features" className="bg-[#F8F8F6] py-20 md:py-28">
      <div className="container-shell">
        <div className="max-w-2xl">
          <p className="text-caption text-[#1A56E8]">Features</p>
          <h2 className="text-h2 mt-3">Everything SMBs need before the legal bill starts.</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className={`rounded-[8px] border border-[var(--border-token)] bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-deep ${
                index === 0 || index === 1 ? "md:col-span-1" : ""
              }`}
            >
              <feature.icon className="h-7 w-7 text-[#1A56E8]" />
              <h3 className="text-h3 mt-6">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#4A4A48]">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
