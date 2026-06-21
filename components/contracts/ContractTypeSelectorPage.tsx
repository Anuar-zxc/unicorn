"use client";

import { useLanguage } from "@/components/providers/AppProviders";
import { ContractTypeGrid } from "@/components/contracts/ContractTypeGrid";
import type { ContractTypeDefinition } from "@/lib/contract-types";

export function ContractTypeSelectorPage({
  accountType,
  types
}: {
  accountType: "lawyer" | "individual";
  types: ContractTypeDefinition[];
}) {
  const { locale } = useLanguage();
  const ru = locale === "ru";
  const lawyer = accountType === "lawyer";
  return (
    <main className="p-4 md:p-6">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--accent)]">
          {lawyer
            ? ru ? "Профессиональная подготовка документов" : "Professional drafting"
            : ru ? "Пошаговый конструктор договоров" : "Guided agreement builder"}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          {lawyer
            ? ru ? "Выберите документ" : "Choose a document to draft"
            : ru ? "Какой договор вы хотите создать?" : "What do you want to create?"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          {lawyer
            ? ru
              ? "Lexo задаст несколько точных вопросов, соберёт документ и сохранит сессию."
              : "Lexo asks a few focused questions, builds the document live, and saves the drafting session."
            : ru
              ? "Отвечайте на простые вопросы по одному. Lexo соберёт понятный договор и объяснит важные условия."
              : "Answer simple questions one at a time. Lexo will build a clear agreement and explain the important parts."}
        </p>
      </div>
      <ContractTypeGrid accountType={accountType} types={types} />
    </main>
  );
}
