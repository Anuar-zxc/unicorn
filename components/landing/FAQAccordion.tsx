"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/components/providers/AppProviders";
import { cn } from "@/lib/utils";

export const FAQ = {
  ru: [
    {
      q: "Это юридическая консультация?",
      a: "Нет. Lexo — AI-ассистент: он объясняет договоры и правовые вопросы, готовит черновики и ссылается на источники. Решения с серьёзными последствиями стоит согласовать с юристом — Lexo подскажет, какие вопросы ему задать."
    },
    {
      q: "Законы какой страны знает Lexo?",
      a: "Основной фокус — Казахстан: Конституция, Гражданский, Трудовой, Предпринимательский и Гражданский процессуальный кодексы и закон о персональных данных из ИПС «Әділет». На общие вопросы по другим юрисдикциям Lexo тоже отвечает, но с явной пометкой о проверке."
    },
    {
      q: "Сколько стоит?",
      a: "Есть бесплатный план без банковской карты: 1 проверка договора, 1 документ и 5 вопросов в месяц. Платные тарифы для юристов — от $19 в месяц, отменить можно в любой момент."
    },
    {
      q: "Какие файлы можно загрузить?",
      a: "PDF, DOCX и фото или сканы (JPG, PNG, WEBP, HEIC) до 10 МБ. Сканы распознаются автоматически."
    },
    {
      q: "Что происходит с моими документами?",
      a: "Файлы хранятся в приватном хранилище и доступны только вашему аккаунту. Любой отчёт вместе с файлом можно удалить в истории в один клик. Мы не используем ваши документы для обучения моделей."
    },
    {
      q: "На каком языке отвечает Lexo?",
      a: "На русском или английском — переключается одной кнопкой. Договор при этом может быть на русском, казахском или английском."
    }
  ],
  en: [
    {
      q: "Is this legal advice?",
      a: "No. Lexo is an AI assistant: it explains contracts and legal questions, prepares drafts, and cites sources. For decisions with serious consequences, confirm with a lawyer — Lexo tells you which questions to ask."
    },
    {
      q: "Which country's law does Lexo know?",
      a: "The main focus is Kazakhstan: the Constitution, the Civil, Labour, Entrepreneurial and Civil Procedure codes, and the personal data law from the official Adilet database. Lexo also answers general questions about other jurisdictions, clearly flagged for verification."
    },
    {
      q: "How much does it cost?",
      a: "There is a free plan with no credit card: 1 contract check, 1 document and 5 questions per month. Paid plans for lawyers start at $19/month and can be cancelled at any time."
    },
    {
      q: "Which files can I upload?",
      a: "PDF, DOCX, and photos or scans (JPG, PNG, WEBP, HEIC) up to 10 MB. Scans are read automatically."
    },
    {
      q: "What happens to my documents?",
      a: "Files are kept in private storage that only your account can access. You can delete any report together with its file from history in one click. We do not use your documents to train models."
    },
    {
      q: "Which language does Lexo answer in?",
      a: "Russian or English — one toggle. The contract itself can be in Russian, Kazakh, or English."
    }
  ]
};

export function FAQAccordion() {
  const { locale } = useLanguage();
  const items = FAQ[locale];
  const [active, setActive] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-shell max-w-3xl">
        <div className="text-center">
          <p className="text-caption text-[var(--accent)]">FAQ</p>
          <h2 className="text-h2 mt-3">{locale === "ru" ? "Ответы до того, как вы начнёте." : "Clear answers before you start."}</h2>
        </div>
        <div className="mt-10 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--bg-page)]">
          {items.map((item, index) => {
            const open = active === index;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    id={`faq-q-${index}`}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left font-display font-semibold"
                    onClick={() => setActive(open ? null : index)}
                    aria-expanded={open}
                    aria-controls={`faq-a-${index}`}
                  >
                    {item.q}
                    <ChevronDown className={cn("h-5 w-5 shrink-0 transition", open && "rotate-180")} />
                  </button>
                </h3>
                <div
                  id={`faq-a-${index}`}
                  role="region"
                  aria-labelledby={`faq-q-${index}`}
                  className={cn(
                    "grid transition-all duration-300",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-6 text-[var(--text-secondary)]">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
