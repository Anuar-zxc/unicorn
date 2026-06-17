"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Scale, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useLanguage } from "@/components/providers/AppProviders";
import { cn } from "@/lib/utils";

const navText = {
  en: {
    problem: "Risks",
    how: "How it works",
    features: "Features",
    testimonials: "Stories",
    pricing: "Pricing",
    trust: "Security",
    dashboard: "Dashboard",
    login: "Log in",
    cta: "Analyze my contract"
  },
  ru: {
    problem: "Риски",
    how: "Как работает",
    features: "Функции",
    testimonials: "Отзывы",
    pricing: "Тарифы",
    trust: "Безопасность",
    dashboard: "Кабинет",
    login: "Войти",
    cta: "Проверить договор"
  }
};

export function Navbar() {
  const { locale } = useLanguage();
  const text = navText[locale];
  const links = [
    { href: "#problem", label: text.problem },
    { href: "#how-it-works", label: text.how },
    { href: "#features", label: text.features },
    { href: "#testimonials", label: text.testimonials },
    { href: "#pricing", label: text.pricing },
    { href: "#trust", label: text.trust }
  ];
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 80);
      setHidden(window.innerWidth < 768 && currentY > lastY && currentY > 120);
      lastY = currentY;
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        hidden && "-translate-y-full md:translate-y-0",
        scrolled && "border-b border-[var(--border)] bg-[var(--bg-page)]/80 backdrop-blur-xl"
      )}
    >
      <nav className="container-shell flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-light)] text-[var(--accent)]">
            <Scale className="h-5 w-5" />
          </span>
          Lexo
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-surface)]/70 p-1 lg:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-page)] hover:text-[var(--text-primary)] hover:shadow-[var(--shadow-sm)] xl:text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link href="/dashboard">
            <Button variant="ghost">{text.dashboard}</Button>
          </Link>
          <Link href="/auth/signin">
            <Button variant="ghost">{text.login}</Button>
          </Link>
          <Link href="/auth/signup">
            <Button>{text.cta}</Button>
          </Link>
        </div>

        <button
          aria-label="Open menu"
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </nav>

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-[min(86vw,360px)] border-l border-[var(--border)] bg-[var(--bg-page)] p-6 shadow-[var(--shadow-lg)] transition-transform duration-300 md:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <span className="font-display text-lg font-semibold">Lexo</span>
          <button
            aria-label="Close menu"
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-col gap-5">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="text-lg font-medium" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <div className="flex gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <div className="mt-4 grid gap-3">
            <Link href="/dashboard" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full">{text.dashboard}</Button>
            </Link>
            <Link href="/auth/signin" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full">{text.login}</Button>
            </Link>
            <Link href="/auth/signup" onClick={() => setOpen(false)}>
              <Button className="w-full">{text.cta}</Button>
            </Link>
          </div>
        </div>
      </div>
      {open && (
        <button
          aria-label="Close menu overlay"
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  );
}
