"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { useLanguage } from "@/components/providers/AppProviders";

const copy = {
  en: {
    tagline: "AI-powered legal workspace for modern law practices.",
    columns: [
      { title: "Workspace", links: [["Contract Review", "/dashboard/review"], ["Case Research", "/dashboard/research"], ["Draft Generator", "/dashboard/draft"], ["Case Prep", "/dashboard/caseprep"]] },
      { title: "Product", links: [["Redline Compare", "/dashboard/compare"], ["Client Summary", "/dashboard/client"], ["Pricing", "/#pricing"], ["Security", "/#trust"]] },
      { title: "Legal", links: [["Privacy", "/privacy"], ["Terms", "/terms"], ["AI use policy", "/terms"], ["Contact", "mailto:hello@lexo.ai"]] }
    ],
    copyright: "© 2026 Lexo. Professional legal AI workspace.",
    disclaimer: "AI-assisted analysis — attorney review recommended before client delivery."
  },
  ru: {
    tagline: "AI-пространство для современной юридической практики.",
    columns: [
      { title: "Инструменты", links: [["Проверка договоров", "/dashboard/review"], ["Исследование дел", "/dashboard/research"], ["Создание документов", "/dashboard/draft"], ["Подготовка дела", "/dashboard/caseprep"]] },
      { title: "Продукт", links: [["Сравнение версий", "/dashboard/compare"], ["Резюме для клиента", "/dashboard/client"], ["Тарифы", "/#pricing"], ["Безопасность", "/#trust"]] },
      { title: "Правовая информация", links: [["Конфиденциальность", "/privacy"], ["Условия", "/terms"], ["Политика AI", "/terms"], ["Контакты", "mailto:hello@lexo.ai"]] }
    ],
    copyright: "© 2026 Lexo. Профессиональное юридическое AI-пространство.",
    disclaimer: "AI-анализ требует проверки юристом перед передачей клиенту."
  }
};

export function Footer() {
  const { locale } = useLanguage();
  const text = copy[locale];
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-surface)]">
      <div className="container-shell grid gap-10 py-14 md:grid-cols-[1.2fr_1.8fr]">
        <div>
          <Logo className="text-[30px]" />
          <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">{text.tagline}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {text.columns.map((column) => <div key={column.title}><h3 className="text-sm font-semibold">{column.title}</h3><ul className="mt-4 space-y-3 text-sm text-[var(--text-secondary)]">{column.links.map(([label, href]) => <li key={label}><Link href={href} className="hover:text-[var(--text-primary)]">{label}</Link></li>)}</ul></div>)}
        </div>
      </div>
      <div className="container-shell flex flex-col gap-2 border-t border-[var(--border)] py-6 text-xs text-[var(--text-muted)] sm:flex-row sm:justify-between">
        <p>{text.copyright}</p>
        <p>{text.disclaimer}</p>
      </div>
    </footer>
  );
}
