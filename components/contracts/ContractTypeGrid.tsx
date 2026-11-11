"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/AppProviders";
import { ArrowRight } from "lucide-react";
import type { ContractTypeDefinition } from "@/lib/contract-types";
import { contractIcon } from "@/components/contracts/contract-icons";

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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((type) => {
              const Icon = contractIcon(type.id);
              const complexity = {
                simple: locale === "ru" ? "~3 мин" : "~3 min",
                medium: locale === "ru" ? "~5 мин" : "~5 min",
                complex: locale === "ru" ? "~10 мин" : "~10 min"
              }[type.complexity];
              return (
                <Link
                  key={type.id}
                  href={`${base}/${type.id}`}
                  className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-5 shadow-[var(--shadow-sm)] transition-[border-color,box-shadow] duration-200 hover:border-[var(--accent)] hover:shadow-[var(--shadow-md)]"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-light)] text-[var(--accent)]">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    {complexity && <span className="text-xs text-[var(--text-muted)]">{complexity}</span>}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">
                    {locale === "ru" ? type.name_ru : type.name}
                  </h3>
                  <p className="mt-1.5 flex-1 text-sm leading-6 text-[var(--text-secondary)]">
                    {locale === "ru" ? type.description_ru : type.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
                    {locale === "ru" ? "Начать" : "Start"}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
