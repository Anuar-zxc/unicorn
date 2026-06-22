"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useLanguage } from "@/components/providers/AppProviders";
import { cn } from "@/lib/utils";

const copy = {
  en: {
    demo: "How it works",
    features: "Features",
    audience: "Who it helps",
    trust: "Security",
    pricing: "Pricing",
    login: "Log in",
    trial: "Start free trial"
  },
  ru: {
    demo: "Как работает",
    features: "Возможности",
    audience: "Для кого",
    trust: "Безопасность",
    pricing: "Тарифы",
    login: "Войти",
    trial: "Начать бесплатно"
  }
};

export function Navbar() {
  const { locale } = useLanguage();
  const text = copy[locale];
  const links = [
    { href: "#demo", label: text.demo },
    { href: "#features", label: text.features },
    { href: "#audience", label: text.audience },
    { href: "#trust", label: text.trust },
    { href: "#pricing", label: text.pricing }
  ];
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 border-b border-transparent bg-[var(--bg-page)]/80 backdrop-blur-xl transition", scrolled && "border-[var(--border)] bg-[var(--bg-page)]/92 shadow-[var(--shadow-sm)]")}>
      <nav className="container-shell grid h-[76px] grid-cols-[auto_1fr_auto] items-center gap-6">
        <Link href="/" className="justify-self-start"><Logo className="text-[28px]" /></Link>
        <div className="hidden justify-self-center rounded-full border border-[var(--border)] bg-[var(--bg-surface)]/75 p-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-[13px] font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-page)] hover:text-[var(--text-primary)] hover:shadow-[var(--shadow-sm)] xl:px-4"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center justify-self-end gap-2 lg:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link href="/auth/signin"><Button variant="ghost">{text.login}</Button></Link>
          <Link href="/auth/signup"><Button>{text.trial}</Button></Link>
        </div>
        <button aria-label="Open menu" className="justify-self-end rounded-lg p-2 lg:hidden" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
      </nav>
      <div className={cn("fixed inset-y-0 right-0 z-50 w-[min(88vw,360px)] border-l border-[var(--border)] bg-[var(--bg-page)] p-6 transition-transform lg:hidden", open ? "translate-x-0" : "translate-x-full")}>
        <div className="flex items-center justify-between"><Logo className="text-[28px]" /><button aria-label="Close menu" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button></div>
        <div className="mt-10 grid gap-6">
          {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-lg font-medium">{link.label}</Link>)}
          <div className="flex gap-2"><LanguageSwitcher /><ThemeToggle /></div>
          <Link href="/auth/signin"><Button variant="outline" className="w-full">{text.login}</Button></Link>
          <Link href="/auth/signup"><Button className="w-full">{text.trial}</Button></Link>
        </div>
      </div>
    </header>
  );
}
