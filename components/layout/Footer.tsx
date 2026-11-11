"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { useLanguage } from "@/components/providers/AppProviders";
import { CONTACT_EMAIL } from "@/lib/site";

const copy = {
  en: {
    tagline: "Clear legal guidance for people, businesses, and modern law practices.",
    columns: [
      { title: "Tools", links: [["Check a contract", "/dashboard/check"], ["Ask a legal question", "/dashboard/ask"], ["Build a contract", "/dashboard/build"], ["Seller taxes", "/seller-tax"]] },
      { title: "Product", links: [["For lawyers", "/auth/signup?account=lawyer"], ["Pricing", "/#pricing"], ["Security", "/#trust"], ["FAQ", "/#faq"]] },
      { title: "Legal", links: [["Privacy", "/privacy"], ["Terms", "/terms"], ["AI use policy", "/ai-policy"], ["Contact", `mailto:${CONTACT_EMAIL}`]] }
    ],
    copyright: `© ${new Date().getFullYear()} Lexo. Legal AI for people and professionals.`,
    disclaimer: "AI-assisted information is not a substitute for advice from a qualified lawyer."
  },
  ru: {
    tagline: "Понятная юридическая помощь для людей, бизнеса и современной юридической практики.",
    columns: [
      { title: "Инструменты", links: [["Проверить договор", "/dashboard/check"], ["Задать вопрос", "/dashboard/ask"], ["Создать договор", "/dashboard/build"], ["Налоги продавца", "/seller-tax"]] },
      { title: "Продукт", links: [["Для юристов", "/auth/signup?account=lawyer"], ["Тарифы", "/#pricing"], ["Безопасность", "/#trust"], ["FAQ", "/#faq"]] },
      { title: "Правовая информация", links: [["Конфиденциальность", "/privacy"], ["Условия", "/terms"], ["Политика AI", "/ai-policy"], ["Контакты", `mailto:${CONTACT_EMAIL}`]] }
    ],
    copyright: `© ${new Date().getFullYear()} Lexo. Юридический AI для людей и профессионалов.`,
    disclaimer: "AI-информация не заменяет консультацию квалифицированного юриста."
  }
};

export function Footer() {
  const { locale } = useLanguage();
  const text = copy[locale];
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-surface)]">
      <div className="container-shell grid grid-cols-1 gap-10 py-14 md:grid-cols-[1.2fr_1.8fr]">
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
