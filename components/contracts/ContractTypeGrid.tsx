"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/AppProviders";
import type { ContractTypeDefinition } from "@/lib/contract-types";

const categoryLabels = {
  lawyer: {
    en: { business: "Business & Commercial", employment: "Employment", real_estate: "Property & Rental", personal: "Personal & Miscellaneous" },
    ru: { business: "Бизнес и коммерция", employment: "Трудовые отношения", real_estate: "Недвижимость и аренда", personal: "Личные договоры" }
  },
  individual: {
    en: { business: "Freelance & Work", employment: "Employment", real_estate: "Property & Rental", personal: "Everyday Agreements" },
    ru: { business: "Работа и фриланс", employment: "Трудовые отношения", real_estate: "Недвижимость и аренда", personal: "Повседневные соглашения" }
  }
} as const;

export function ContractTypeGrid({
  accountType,
  types
}: {
  accountType: "lawyer" | "individual";
  types: ContractTypeDefinition[];
}) {
  const { locale } = useLanguage();
  const grouped = types.reduce<Record<string, ContractTypeDefinition[]>>((acc, type) => {
    (acc[type.category] ||= []).push(type);
    return acc;
  }, {});
  const base = accountType === "lawyer" ? "/dashboard/draft" : "/dashboard/build";

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([category, items]) => (
        <section key={category}>
          <h2 className="mb-3 text-sm font-semibold text-[var(--text-secondary)]">
            {categoryLabels[accountType][locale][category as keyof typeof categoryLabels.lawyer.en] || category}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((type) => (
              <Link
                key={type.id}
                href={`${base}/${type.id}`}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[var(--shadow-md)]"
              >
                <div className="text-2xl">{type.icon}</div>
                <h3 className="mt-3 font-display text-lg font-semibold group-hover:text-[var(--accent)]">
                  {locale === "ru" ? type.name_ru : type.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {locale === "ru" ? type.description_ru : type.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
