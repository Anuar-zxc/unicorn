"use client";

import Link from "next/link";
import { Linkedin, Scale, Twitter } from "lucide-react";
import { useLanguage } from "@/components/providers/AppProviders";

const footerText = {
  en: {
    tagline: "Plain-English contract analysis for ordinary people and small businesses.",
    made: "Made with care for small businesses",
    trust: "SOC2 compliant · AES-256 encrypted · No data sold",
    privacy: "Privacy Policy",
    terms: "Terms",
    columns: [
      { title: "Product", links: ["Analyze Contract", "Previous Analyses", "Billing", "Pricing"] },
      { title: "Trust", links: ["Private Storage", "AI Disclaimer", "Simple Language", "Secure Upload"] },
      { title: "Legal", links: ["Privacy Policy", "Terms", "Security", "Disclaimer"] },
      { title: "Company", links: ["About", "Roadmap", "Contact", "Support"] }
    ]
  },
  ru: {
    tagline: "Понятный анализ договоров для обычных людей и малого бизнеса.",
    made: "Сделано с заботой о малом бизнесе",
    trust: "SOC2 compliant · AES-256 шифрование · Данные не продаются",
    privacy: "Политика конфиденциальности",
    terms: "Условия",
    columns: [
      { title: "Продукт", links: ["Анализ договора", "История", "Оплата", "Тарифы"] },
      { title: "Доверие", links: ["Приватное хранение", "AI дисклеймер", "Простой язык", "Безопасная загрузка"] },
      { title: "Правовое", links: ["Конфиденциальность", "Условия", "Безопасность", "Дисклеймер"] },
      { title: "Компания", links: ["О нас", "План развития", "Контакты", "Поддержка"] }
    ]
  }
};

const social = [
  { name: "LinkedIn", href: "https://linkedin.com/company/lexo", icon: Linkedin },
  { name: "Twitter/X", href: "https://twitter.com/lexo", icon: Twitter }
];

const footerHref: Record<string, string> = {
  "Analyze Contract": "/dashboard/analyze",
  "Previous Analyses": "/dashboard/history",
  Billing: "/dashboard/billing",
  Pricing: "/#pricing",
  "Private Storage": "/#trust",
  "AI Disclaimer": "/terms",
  "Simple Language": "/#features",
  "Secure Upload": "/#trust",
  "Privacy Policy": "/privacy",
  Terms: "/terms",
  Security: "/#trust",
  Disclaimer: "/terms",
  About: "/#problem",
  Roadmap: "/#features",
  Contact: "mailto:hello@lexo.ai",
  Support: "mailto:support@lexo.ai",
  "Анализ договора": "/dashboard/analyze",
  История: "/dashboard/history",
  Оплата: "/dashboard/billing",
  Тарифы: "/#pricing",
  "Приватное хранение": "/#trust",
  "AI дисклеймер": "/terms",
  "Простой язык": "/#features",
  "Безопасная загрузка": "/#trust",
  Конфиденциальность: "/privacy",
  Условия: "/terms",
  Безопасность: "/#trust",
  Дисклеймер: "/terms",
  "О нас": "/#problem",
  "План развития": "/#features",
  Контакты: "mailto:hello@lexo.ai",
  Поддержка: "mailto:support@lexo.ai"
};

export function Footer() {
  const { locale } = useLanguage();
  const text = footerText[locale];

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-surface)]">
      <div className="container-shell grid gap-10 py-14 md:grid-cols-[1.4fr_2fr]">
        <div>
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-light)] text-[var(--accent)]">
              <Scale className="h-5 w-5" />
            </span>
            Lexo
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
            {text.tagline}
          </p>
          <div className="mt-6 flex gap-3">
            {social.map((item) => (
              <Link
                key={item.name}
                aria-label={item.name}
                href={item.href}
                className="rounded-full border border-[var(--border)] p-2 text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <item.icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {text.columns.map((column) => (
            <div key={column.title}>
              <h3 className="font-display text-sm font-semibold">{column.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-[var(--text-secondary)]">
                {column.links.map((item) => (
                  <li key={item}>
                    <Link href={footerHref[item] ?? "/"} className="hover:text-[var(--text-primary)]">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="container-shell flex flex-col gap-3 border-t border-[var(--border)] py-6 text-sm text-[var(--text-muted)] md:flex-row md:items-center md:justify-between">
        <div>
          <p>© 2025 Lexo Inc. · {text.made}</p>
          <p className="mt-1">{text.trust}</p>
        </div>
        <div className="flex gap-5">
          <Link href="/privacy">{text.privacy}</Link>
          <Link href="/terms">{text.terms}</Link>
        </div>
      </div>
    </footer>
  );
}
