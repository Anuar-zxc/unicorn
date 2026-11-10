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
    trial: "Start free",
    menu: "Open menu",
    close: "Close menu"
  },
  ru: {
    demo: "Как работает",
    features: "Возможности",
    audience: "Для кого",
    trust: "Безопасность",
    pricing: "Тарифы",
    login: "Войти",
    trial: "Начать бесплатно",
    menu: "Открыть меню",
    close: "Закрыть меню"
  }
};

export function Navbar() {
  const { locale } = useLanguage();
  const text = copy[locale];
  const links = [
    // Absolute anchors so the menu also works from /terms, /privacy, etc.
    { href: "/#demo", label: text.demo },
    { href: "/#features", label: text.features },
    { href: "/#audience", label: text.audience },
    { href: "/#pricing", label: text.pricing },
    { href: "/#faq", label: "FAQ" }
  ];
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <>
    <header className={cn("fixed inset-x-0 top-0 z-50 border-b border-transparent bg-[var(--bg-page)]/80 backdrop-blur-xl transition", scrolled && "border-[var(--border)] bg-[var(--bg-page)]/92 shadow-[var(--shadow-sm)]")}>
      <nav className="container-shell grid h-[76px] grid-cols-[auto_1fr_auto] items-center gap-6">
        <Link href="/" className="justify-self-start" aria-label="Lexo"><Logo className="text-[28px]" /></Link>
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
          <Button asChild variant="ghost"><Link href="/auth/signin">{text.login}</Link></Button>
          <Button asChild><Link href="/auth/signup">{text.trial}</Link></Button>
        </div>
        <button aria-label={text.menu} aria-expanded={open} aria-controls="mobile-menu" className="justify-self-end rounded-lg p-2 lg:hidden" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
      </nav>
    </header>
      {/* Drawer lives outside <header>: backdrop-filter on the header would turn it
          into the containing block and clip this fixed panel to 76px. */}
      <div
        className={cn("fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={text.menu}
        inert={!open}
        className={cn("fixed inset-y-0 right-0 z-50 h-dvh w-[min(88vw,360px)] overflow-y-auto border-l border-[var(--border)] bg-[var(--bg-page)] p-6 transition-transform lg:hidden", open ? "translate-x-0" : "translate-x-full")}
      >
        <div className="flex items-center justify-between"><Logo className="text-[28px]" /><button aria-label={text.close} onClick={() => setOpen(false)}><X className="h-5 w-5" /></button></div>
        <div className="mt-10 grid gap-6">
          {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-lg font-medium">{link.label}</Link>)}
          <div className="flex gap-2"><LanguageSwitcher /><ThemeToggle /></div>
          <Button asChild variant="outline" className="w-full"><Link href="/auth/signin">{text.login}</Link></Button>
          <Button asChild className="w-full"><Link href="/auth/signup">{text.trial}</Link></Button>
        </div>
      </div>
    </>
  );
}
