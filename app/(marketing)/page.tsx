"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  Clock3,
  FileDiff,
  FileSearch,
  FileText,
  FolderKanban,
  LockKeyhole,
  MessageSquareText,
  Scale,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PricingTable } from "@/components/landing/PricingTable";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/AppProviders";

const stats = [
  ["70%", "faster contract review"],
  ["3x", "more cases per lawyer"],
  ["$0", "extra staff needed"],
  ["28 sec", "average analysis"]
];
const statsRu = [["70%", "быстрее проверка договоров"], ["3x", "больше дел на юриста"], ["$0", "затрат на дополнительный штат"], ["28 сек", "среднее время анализа"]];

const painPoints = [
  "Reading 80-page contracts to find three relevant clauses",
  "Writing the same boilerplate clauses for the 500th time",
  "Researching case law across twelve different databases",
  "Preparing intake summaries before every client meeting",
  "Formatting and proofreading documents at 11pm"
];
const painPointsRu = ["Читать 80-страничный договор ради трёх важных пунктов", "Писать одни и те же стандартные положения в пятисотый раз", "Искать судебную практику в двенадцати разных базах", "Готовить вводные резюме перед каждой встречей с клиентом", "Форматировать и вычитывать документы в 11 вечера"];

const features = [
  {
    title: "Contract Review",
    description: "Clause-by-clause risk analysis, missing terms, and attorney-ready suggested revisions.",
    detail: "PDF & DOCX · up to 500 pages",
    icon: FileSearch,
    className: "md:col-span-2"
  },
  {
    title: "Case Research",
    description: "Jurisdiction-specific statutes, precedents, conflicting authority, and research memos.",
    detail: "Citations · confidence levels",
    icon: BookOpen
  },
  {
    title: "Draft Generator",
    description: "Professional first drafts for contracts, motions, demand letters, opinions, and briefs.",
    detail: "Editable · versioned",
    icon: FileText
  },
  {
    title: "Case Prep",
    description: "Turn facts and documents into timelines, issue maps, interview agendas, and strategy options.",
    detail: "Matter-ready intake memo",
    icon: FolderKanban,
    className: "md:col-span-2"
  },
  {
    title: "Redline Compare",
    description: "Classify every change as favorable, unfavorable, or neutral and prepare negotiation responses.",
    detail: "Two-version comparison",
    icon: FileDiff
  },
  {
    title: "Client Summary",
    description: "Translate legal analysis into precise, plain-language client communication and next steps.",
    detail: "Standard or simplified",
    icon: MessageSquareText
  }
];
const featuresRu = [
  { title: "Проверка договоров", description: "Постатейный анализ рисков, отсутствующих условий и готовые формулировки изменений.", detail: "PDF и DOCX · до 500 страниц", icon: FileSearch, className: "md:col-span-2" },
  { title: "Исследование дел", description: "Нормы права, судебные прецеденты, противоречивая практика и исследовательские меморандумы.", detail: "Ссылки · уровень уверенности", icon: BookOpen },
  { title: "Создание документов", description: "Профессиональные первые версии договоров, ходатайств, претензий, заключений и brief-ов.", detail: "Редактирование · версии", icon: FileText },
  { title: "Подготовка дела", description: "Хронология, карта правовых вопросов, варианты стратегии и повестка интервью с клиентом.", detail: "Готовый intake-меморандум", icon: FolderKanban, className: "md:col-span-2" },
  { title: "Сравнение версий", description: "Классификация каждого изменения и рекомендации для переговоров.", detail: "Сравнение двух версий", icon: FileDiff },
  { title: "Резюме для клиента", description: "Точный перевод юридического анализа на понятный клиенту язык и следующие шаги.", detail: "Стандартный или упрощённый", icon: MessageSquareText }
];

const profiles = [
  {
    role: "Solo practitioner",
    quote: "I handle 40+ contracts a month alone. Lexo is like having a paralegal.",
    icon: Scale
  },
  {
    role: "Law firm partner",
    quote: "Our associates spend 60% less time on first drafts.",
    icon: Users
  },
  {
    role: "In-house counsel",
    quote: "I review every vendor contract before signing. Used to take a day. Now 20 minutes.",
    icon: BriefcaseBusiness
  }
];
const profilesRu = [
  { role: "Частнопрактикующий юрист", quote: "Я один веду более 40 договоров в месяц. Lexo работает как паралигал.", icon: Scale },
  { role: "Партнёр юридической фирмы", quote: "Наши юристы тратят на 60% меньше времени на первые версии документов.", icon: Users },
  { role: "Корпоративный юрист", quote: "Раньше проверка договора поставщика занимала день. Теперь — 20 минут.", icon: BriefcaseBusiness }
];

export default function MarketingPage() {
  const { locale } = useLanguage();
  const ru = locale === "ru";
  const localizedStats = ru ? statsRu : stats;
  const localizedPainPoints = ru ? painPointsRu : painPoints;
  const localizedFeatures = ru ? featuresRu : features;
  const localizedProfiles = ru ? profilesRu : profiles;
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-[var(--border)] pb-20 pt-32 md:pb-28 md:pt-40">
          <div className="absolute inset-0 -z-10 grid-bg opacity-60" />
          <div className="container-shell grid items-center gap-14 lg:grid-cols-[0.88fr_1.12fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-page)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-sm)]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
                {ru ? "AI-пространство, созданное для юристов" : "The AI workspace built for lawyers"}
              </div>
              <h1 className="mt-7 font-display text-[clamp(46px,6.5vw,78px)] font-semibold leading-[0.98] tracking-[-0.055em]">
                {ru ? "Ведите больше дел." : "Handle more cases."}<br />
                {ru ? "Выставляйте больше часов." : "Bill more hours."}<br />
                <span className="text-[var(--accent)]">{ru ? "Выгорайте меньше." : "Burn out less."}</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
                {ru ? "AI выполняет проверку договоров, правовые исследования, подготовку документов и дел — за минуты, а не часы." : "AI that does contract review, legal research, document drafting, and case prep — in minutes, not hours."}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/auth/signup">
                  <Button size="lg">{ru ? "Начать бесплатно" : "Start free trial"} <ArrowRight className="h-4 w-4" /></Button>
                </Link>
                <Link href="#demo">
                  <Button size="lg" variant="outline">{ru ? "Посмотреть пример" : "See a demo"}</Button>
                </Link>
              </div>
              <p className="mt-5 text-xs text-[var(--text-muted)]">
                {ru ? "14 дней бесплатно · Без карты · Юрист сохраняет полный контроль" : "14-day trial · No credit card · Attorney review stays in control"}
              </p>
            </div>

            <div id="demo" className="rounded-2xl border border-[#2b2f3a] bg-[#0b0d12] p-3 shadow-[0_30px_80px_rgba(15,23,42,.22)]">
              <div className="flex items-center justify-between border-b border-white/10 px-3 pb-3 text-xs text-white/45">
                <span>Vendor_MSA_v4.pdf · {ru ? "40 страниц" : "40 pages"}</span>
                <span className="flex items-center gap-2 text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />{ru ? "Анализ завершён" : "Analysis complete"}</span>
              </div>
              <div className="grid min-h-[430px] gap-3 pt-3 md:grid-cols-[1.08fr_.92fr]">
                <div className="rounded-xl bg-[#151820] p-5 text-sm leading-7 text-white/65">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[.16em] text-white/35">{ru ? "Исходный договор" : "Original contract"}</p>
                  <p>8.2 Limitation of Liability</p>
                  <p className="mt-3 rounded-md border-l-2 border-amber-400 bg-amber-400/10 px-3 py-2 text-white/85">
                    Client shall indemnify Provider against any and all claims, losses, damages, and expenses...
                  </p>
                  <p className="mt-5">9.1 Term and Termination</p>
                  <p className="mt-3 rounded-md border-l-2 border-red-400 bg-red-400/10 px-3 py-2 text-white/85">
                    This Agreement renews automatically for successive twelve-month periods...
                  </p>
                  <p className="mt-5 text-white/35">10. Confidentiality</p>
                  <p className="mt-2 text-white/25">Each party shall maintain in confidence...</p>
                </div>
                <div className="rounded-xl bg-white p-5 text-[#111827]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#667085]">{ru ? "Отчёт о рисках" : "Risk report"}</p>
                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">{ru ? "2 высоких риска" : "2 high risks"}</span>
                  </div>
                  <h2 className="mt-5 font-display text-xl font-semibold">{ru ? "Резюме для юриста" : "Attorney review summary"}</h2>
                  <div className="mt-5 space-y-3">
                    <ReportRow tone="red" title="Auto-renewal" text="60-day cancellation window creates lock-in exposure." />
                    <ReportRow tone="amber" title="Broad indemnity" text="One-sided obligation with no liability cap." />
                    <ReportRow tone="green" title="Confidentiality" text="Mutual and within market range." />
                  </div>
                  <div className="mt-5 rounded-lg bg-[#f4f6fa] p-4">
                    <p className="text-xs font-bold uppercase tracking-[.12em] text-[#667085]">{ru ? "Предлагаемая редакция" : "Suggested revision"}</p>
                    <p className="mt-2 text-sm leading-6">“Renewal requires written confirmation by both parties at least 30 days before expiration.”</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--border)] bg-[#0d1424] py-8 text-white">
          <div className="container-shell grid grid-cols-2 gap-7 md:grid-cols-4">
            {localizedStats.map(([value, label]) => (
              <div key={label}>
                <p className="font-display text-3xl font-semibold">{value}</p>
                <p className="mt-1 text-sm text-white/55">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="for-firms" className="py-20 md:py-28">
          <div className="container-shell">
            <p className="text-caption text-[var(--accent)]">{ru ? "Административная нагрузка" : "The administrative drag"}</p>
            <div className="mt-3 grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
              <h2 className="text-h2">{ru ? "Что юристы действительно не любят делать." : "What lawyers actually hate doing."}</h2>
              <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
                {localizedPainPoints.map((point, index) => (
                  <div key={point} className="flex gap-5 py-5">
                    <span className="font-display text-sm font-semibold text-[var(--accent)]">0{index + 1}</span>
                    <p className="text-base font-medium">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-[var(--bg-surface)] py-20 md:py-28">
          <div className="container-shell">
            <div className="max-w-3xl">
              <p className="text-caption text-[var(--accent)]">{ru ? "Единое профессиональное пространство" : "One professional workspace"}</p>
              <h2 className="text-h2 mt-3">{ru ? "Шесть инструментов для всей работы от поручения до консультации." : "Six tools for the work between instruction and advice."}</h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {localizedFeatures.map((feature) => (
                <article key={feature.title} className={`rounded-xl border border-[var(--border)] bg-[var(--bg-page)] p-6 shadow-[var(--shadow-sm)] ${feature.className ?? ""}`}>
                  <feature.icon className="h-6 w-6 text-[var(--accent)]" />
                  <h3 className="mt-8 font-display text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">{feature.description}</p>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[.12em] text-[var(--text-muted)]">{feature.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container-shell">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-caption text-[var(--accent)]">{ru ? "Создано вокруг практики" : "Designed around practice"}</p>
              <h2 className="text-h2 mt-3">{ru ? "Создано под реальную работу юристов." : "Built for how lawyers actually work."}</h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {localizedProfiles.map((profile) => (
                <article key={profile.role} className="rounded-xl border border-[var(--border)] p-6">
                  <profile.icon className="h-6 w-6 text-[var(--accent)]" />
                  <p className="mt-8 text-lg leading-7">“{profile.quote}”</p>
                  <p className="mt-6 text-sm font-semibold text-[var(--text-secondary)]">{profile.role}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <PricingTable />

        <section id="trust" className="bg-[#0d1424] py-20 text-white md:py-24">
          <div className="container-shell grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-caption text-[#8fb0ff]">{ru ? "Безопасность и контроль" : "Security and control"}</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight">{ru ? "Документы клиентов остаются защищёнными материалами вашей работы." : "Your client documents stay privileged work product."}</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                [LockKeyhole, ru ? "Шифрование AES-256" : "AES-256 encryption", ru ? "Документы защищены при передаче и хранении." : "Documents encrypted in transit and at rest."],
                [ShieldCheck, ru ? "Без обучения на данных" : "No model training", ru ? "Ваши данные не используются для обучения AI-моделей." : "Your data is never used to train AI models."],
                [Clock3, ru ? "SOC 2 в процессе" : "SOC 2 in progress", ru ? "Контроли безопасности для профессиональных юридических команд." : "Controls designed for professional legal teams."],
                [Scale, ru ? "Готовность к GDPR" : "GDPR-ready", ru ? "Процессы обработки данных для юридических фирм ЕС." : "Data practices prepared for EU law firms."]
              ].map(([Icon, title, text]) => {
                const TrustIcon = Icon as typeof LockKeyhole;
                return (
                  <div key={String(title)} className="rounded-xl border border-white/10 bg-white/[.04] p-5">
                    <TrustIcon className="h-5 w-5 text-[#8fb0ff]" />
                    <p className="mt-5 font-semibold">{String(title)}</p>
                    <p className="mt-2 text-sm leading-6 text-white/55">{String(text)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 text-center md:py-28">
          <div className="container-shell">
            <h2 className="mx-auto max-w-4xl font-display text-4xl font-semibold tracking-tight md:text-6xl">{ru ? "Делайте работу трёх юристов. Оставайтесь одним." : "Do the work of three lawyers. Be one."}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">{ru ? "Профессиональный AI для проверки, исследований, подготовки документов и дел — с полным контролем юриста." : "Professional-grade AI for review, research, drafting, and case preparation — with the attorney always in control."}</p>
            <Link href="/auth/signup" className="mt-8 inline-block">
              <Button size="lg">{ru ? "Начать бесплатно" : "Start free trial"} <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ReportRow({ tone, title, text }: { tone: "red" | "amber" | "green"; title: string; text: string }) {
  const colors = {
    red: "bg-red-500",
    amber: "bg-amber-500",
    green: "bg-emerald-500"
  };
  return (
    <div className="flex gap-3 rounded-lg border border-[#e7e9ee] p-3">
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${colors[tone]}`} />
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs leading-5 text-[#667085]">{text}</p>
      </div>
    </div>
  );
}
