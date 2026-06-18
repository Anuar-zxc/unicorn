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
  en: { features: "Features", pricing: "Pricing", firms: "For Firms", login: "Log in", trial: "Start free trial" },
  ru: { features: "Возможности", pricing: "Тарифы", firms: "Для фирм", login: "Войти", trial: "Начать бесплатно" }
};

export function Navbar() {
  const { locale } = useLanguage();
  const text = copy[locale];
  const links = [
    { href: "#features", label: text.features },
    { href: "#pricing", label: text.pricing },
    { href: "#for-firms", label: text.firms }
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
    <header className={cn("fixed inset-x-0 top-0 z-50 border-b border-transparent transition", scrolled && "border-[var(--border)] bg-[var(--bg-page)]/90 backdrop-blur-xl")}>
      <nav className="container-shell flex h-18 items-center justify-between py-4">
        <Link href="/"><Logo className="text-[28px]" /></Link>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => <Link key={link.href} href={link.href} className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">{link.label}</Link>)}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link href="/auth/signin"><Button variant="ghost">{text.login}</Button></Link>
          <Link href="/auth/signup"><Button>{text.trial}</Button></Link>
        </div>
        <button aria-label="Open menu" className="rounded-lg p-2 md:hidden" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
      </nav>
      <div className={cn("fixed inset-y-0 right-0 z-50 w-[min(88vw,360px)] border-l border-[var(--border)] bg-[var(--bg-page)] p-6 transition-transform md:hidden", open ? "translate-x-0" : "translate-x-full")}>
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
