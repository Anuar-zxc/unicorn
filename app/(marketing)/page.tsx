"use client";

import NextLink from "next/link";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Building2,
  Check,
  CheckCircle,
  CheckCircle2,
  ClipboardCheck,
  FilePlus,
  FileSearch,
  FileText,
  GitCompare,
  Handshake,
  Link as LinkIcon,
  Lock,
  MessageSquare,
  ReceiptText,
  Scale,
  Shield,
  Sparkles,
  Upload,
  Users,
  Zap
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/AppProviders";

const copy = {
  en: {
    heroBadge: "Private AI legal workspace for real people and small businesses",
    heroTitle: "Analyze, build, and strategize legal work with AI.",
    heroSubtitle:
      "Upload a contract, draft a new agreement, or describe a legal problem. Lexo turns it into plain-English risks, strategy, and lawyer-ready briefs.",
    heroCta: "Open Lexo",
    heroSecondary: "See features",
    heroChecks: ["Contract Analyzer", "Contract Builder", "Case Strategist"],
    stats: [
      ["2,400+", "Contracts analyzed"],
      ["18", "Countries"],
      ["28s", "Average analysis time"],
      ["$0", "To get started"]
    ],
    problemEyebrow: "The problem",
    problemTitle: "Most contracts are written for lawyers, not for the people signing them.",
    problems: [
      "People sign contracts they do not understand.",
      "Hidden clauses can cost thousands.",
      "Lawyers are expensive and slow."
    ],
    howEyebrow: "How it works",
    howTitle: "Choose the legal workflow you need today.",
    steps: [
      ["Upload your PDF or DOCX.", "Drop in the contract. Lexo validates the file and stores it securely."],
      ["Lexo extracts and analyzes it.", "The AI reads the contract and looks for confusing clauses, risks, and obligations."],
      ["Receive a simple report.", "See key clauses, risk levels, recommendations, and lawyer questions."]
    ],
    featuresEyebrow: "Features",
    featuresTitle: "A full AI legal assistant platform, not just an upload box",
    testimonialsEyebrow: "Customers",
    testimonialsTitle: "Trusted by founders, operators, and consultants.",
    pricingEyebrow: "Pricing",
    pricingTitle: "Choose the plan that matches how often you sign.",
    monthly: "Monthly",
    annual: "Annual",
    save20: "Save 20%",
    saveYear: "Save",
    perYear: "/year",
    trustEyebrow: "Built for trust from day one",
    ctaTitle: "Ready to stop guessing on legal decisions?",
    ctaSubtitle: "Analyze contracts, build drafts, and prepare case strategy before you pay a lawyer.",
    ctaButton: "Start with Lexo — free",
    noCard: "No credit card required"
  },
  ru: {
    heroBadge: "Приватное AI-юридическое пространство для людей и малого бизнеса",
    heroTitle: "Анализируйте, создавайте и готовьте правовую стратегию с AI.",
    heroSubtitle:
      "Загрузите договор, создайте новый документ или опишите правовую проблему. Lexo превратит это в понятные риски, стратегию и brief для юриста.",
    heroCta: "Открыть Lexo",
    heroSecondary: "Смотреть функции",
    heroChecks: ["Анализ договоров", "Создание договоров", "Стратегия по делу"],
    stats: [
      ["2,400+", "Договоров проанализировано"],
      ["18", "Стран"],
      ["28с", "Среднее время анализа"],
      ["$0", "Для старта"]
    ],
    problemEyebrow: "Проблема",
    problemTitle: "Большинство договоров написаны для юристов, а не для людей, которые их подписывают.",
    problems: [
      "Люди подписывают договоры, которые не понимают.",
      "Скрытые условия могут стоить тысячи долларов.",
      "Юристы стоят дорого и отвечают не сразу."
    ],
    howEyebrow: "Как это работает",
    howTitle: "Выберите юридический сценарий, который нужен сегодня.",
    steps: [
      ["Загрузите PDF или DOCX.", "Добавьте договор. Lexo проверит файл и сохранит его в приватном хранилище."],
      ["Lexo извлечёт текст и проанализирует его.", "AI найдёт спорные пункты, риски и обязательства."],
      ["Получите простой отчёт.", "Смотрите ключевые пункты, уровни риска, рекомендации и вопросы юристу."]
    ],
    featuresEyebrow: "Функции",
    featuresTitle: "Полноценный AI-юридический ассистент, а не просто загрузка файла",
    testimonialsEyebrow: "Отзывы",
    testimonialsTitle: "Lexo помогает основателям, операторам и консультантам.",
    pricingEyebrow: "Тарифы",
    pricingTitle: "Выберите тариф под частоту подписания договоров.",
    monthly: "Месяц",
    annual: "Год",
    save20: "Экономия 20%",
    saveYear: "Экономия",
    perYear: "/год",
    trustEyebrow: "Доверие с первого дня",
    ctaTitle: "Готовы перестать гадать в юридических вопросах?",
    ctaSubtitle: "Анализируйте договоры, создавайте документы и готовьте стратегию до оплаты юриста.",
    ctaButton: "Начать с Lexo бесплатно",
    noCard: "Без банковской карты"
  }
};

const features = {
  en: [
    ["Contract Analyzer", "Upload any contract and get risks, summary, negotiation language, and lawyer questions.", FileSearch, "large"],
    ["Contract Builder", "Describe what you need. Lexo drafts a structured contract with placeholders and AI notes.", FilePlus, "small"],
    ["Case Strategist", "Describe a legal problem and receive laws, arguments, risks, action plan, and demand letter.", Scale, "large"],
    ["Negotiation coach", "Exact counter-language for risky clauses. Copy, paste, send.", MessageSquare, "small"],
    ["Lawyer handoff", "Export a lawyer-ready brief or connect with a verified lawyer for a flat-fee session.", LinkIcon, "small"],
    ["Document history", "Keep reports, drafts, and strategy briefs organized in one private legal workspace.", Users, "small"]
  ],
  ru: [
    ["Анализ договоров", "Загрузите договор и получите риски, summary, язык для переговоров и вопросы юристу.", FileSearch, "large"],
    ["Создание договоров", "Опишите задачу. Lexo подготовит структурированный договор с placeholder-ами и AI notes.", FilePlus, "small"],
    ["Стратегия по делу", "Опишите проблему и получите законы, аргументы, риски, план действий и demand letter.", Scale, "large"],
    ["Тренер переговоров", "Готовые формулировки для спорных пунктов: скопируйте, вставьте, отправьте.", MessageSquare, "small"],
    ["Передача юристу", "Экспортируйте brief для своего юриста или подключите проверенного специалиста.", LinkIcon, "small"],
    ["История документов", "Храните отчёты, черновики и стратегии в одном приватном legal workspace.", Users, "small"]
  ]
} as const;

const testimonials = {
  en: [
    ["I uploaded a vendor contract I'd been staring at for 3 days. Lexo flagged an auto-renewal clause I completely missed. Saved me from a $12,000 mistake.", "Sarah K.", "Founder, boutique design studio", "SK", "#7C3AED"],
    ["We review 20-30 freelancer agreements a month. This cut our review time in half. The negotiation suggestions alone are worth the Pro plan.", "Marcus T.", "Operations Lead, SaaS company", "MT", "#0D7A4E"],
    ["As a non-native English speaker, I was always nervous signing US contracts. Now I actually understand what I'm agreeing to.", "Lena M.", "Independent consultant, Germany", "LM", "#1A56E8"]
  ],
  ru: [
    ["Я загрузила договор с поставщиком, на который смотрела три дня. Lexo нашёл автопродление, которое я пропустила. Это спасло меня от ошибки на $12,000.", "Сара К.", "Основатель дизайн-студии", "SK", "#7C3AED"],
    ["Мы проверяем 20-30 договоров с фрилансерами в месяц. Время ревью сократилось вдвое. Одни только советы по переговорам стоят Pro-тарифа.", "Маркус Т.", "Operations Lead, SaaS-компания", "MT", "#0D7A4E"],
    ["Английский не мой родной язык, и я всегда боялась подписывать договоры в США. Теперь я реально понимаю, на что соглашаюсь.", "Лена М.", "Независимый консультант, Германия", "LM", "#1A56E8"]
  ]
} as const;

type Plan = {
  name: string;
  price: { monthly: number; annual: number };
  description: string;
  badge: string | null;
  cta: string;
  ctaStyle: "outline" | "filled";
  highlight?: boolean;
  features: { text: string; included: boolean }[];
};

const plans: Record<"en" | "ru", Plan[]> = {
  en: [
    {
      name: "Free",
      price: { monthly: 0, annual: 0 },
      description: "For individuals who occasionally need contract clarity.",
      badge: null,
      cta: "Get started free",
      ctaStyle: "outline",
      features: [
        { text: "1 contract analysis per month", included: true },
        { text: "1 contract build per month", included: true },
        { text: "PDF and DOCX upload", included: true },
        { text: "Basic risk report", included: true },
        { text: "Plain-English clause summaries", included: true },
        { text: "AI disclaimer on every report", included: true },
        { text: "Case strategy", included: false },
        { text: "Negotiation playbook", included: false },
        { text: "Analysis history", included: false },
        { text: "Lawyer connection", included: false },
        { text: "Document history", included: false }
      ]
    },
    {
      name: "Pro",
      price: { monthly: 19, annual: 15 },
      description: "For freelancers and small businesses signing regularly.",
      badge: "Most popular",
      cta: "Start 14-day trial",
      ctaStyle: "filled",
      features: [
        { text: "Unlimited contract analyses", included: true },
        { text: "Unlimited contract builds", included: true },
        { text: "Full risk report + negotiation playbook", included: true },
        { text: "2 case strategies per month", included: true },
        { text: "Demand letter generation", included: true },
        { text: "Document history + search", included: true },
        { text: "Export reports as PDF", included: true },
        { text: "Priority AI processing", included: true },
        { text: "Email support", included: true },
        { text: "Lawyer connection", included: false },
        { text: "Team access", included: false }
      ]
    },
    {
      name: "Business",
      price: { monthly: 49, annual: 39 },
      description: "For agencies, growing companies, and power users.",
      badge: "Full platform",
      cta: "Start 14-day trial",
      ctaStyle: "filled",
      highlight: true,
      features: [
        { text: "Everything in Pro", included: true },
        { text: "Unlimited case strategies", included: true },
        { text: "Connect with platform lawyers", included: true },
        { text: "Case brief export for your own lawyer", included: true },
        { text: "5 team members", included: true },
        { text: "40+ contract templates", included: true },
        { text: "API access (100 calls/month)", included: true },
        { text: "Custom AI disclaimer text", included: true },
        { text: "Priority support", included: true }
      ]
    }
  ],
  ru: [
    {
      name: "Free",
      price: { monthly: 0, annual: 0 },
      description: "Для тех, кому иногда нужно понять договор.",
      badge: null,
      cta: "Начать бесплатно",
      ctaStyle: "outline",
      features: [
        { text: "1 анализ договора в месяц", included: true },
        { text: "1 создание договора в месяц", included: true },
        { text: "Загрузка PDF и DOCX", included: true },
        { text: "Базовый risk report", included: true },
        { text: "Краткие объяснения простым языком", included: true },
        { text: "AI дисклеймер в каждом отчёте", included: true },
        { text: "Стратегия по делу", included: false },
        { text: "Negotiation playbook", included: false },
        { text: "История анализов", included: false },
        { text: "Связь с юристом", included: false },
        { text: "История документов", included: false }
      ]
    },
    {
      name: "Pro",
      price: { monthly: 19, annual: 15 },
      description: "Для фрилансеров и малого бизнеса, которые подписывают регулярно.",
      badge: "Популярный",
      cta: "14 дней бесплатно",
      ctaStyle: "filled",
      features: [
        { text: "Безлимитные анализы договоров", included: true },
        { text: "Безлимитное создание договоров", included: true },
        { text: "Полный risk report + negotiation playbook", included: true },
        { text: "2 стратегии по делу в месяц", included: true },
        { text: "Генерация demand letter", included: true },
        { text: "История документов + поиск", included: true },
        { text: "Экспорт отчётов в PDF", included: true },
        { text: "Приоритетная AI-обработка", included: true },
        { text: "Email-поддержка", included: true },
        { text: "Связь с юристом", included: false },
        { text: "Командный доступ", included: false }
      ]
    },
    {
      name: "Business",
      price: { monthly: 49, annual: 39 },
      description: "Для агентств, растущих компаний и power users.",
      badge: "Полная платформа",
      cta: "14 дней бесплатно",
      ctaStyle: "filled",
      highlight: true,
      features: [
        { text: "Всё из Pro", included: true },
        { text: "Безлимитные стратегии по делу", included: true },
        { text: "Подключение platform lawyers", included: true },
        { text: "Экспорт case brief для своего юриста", included: true },
        { text: "5 участников команды", included: true },
        { text: "40+ шаблонов договоров", included: true },
        { text: "API доступ, 100 запросов/месяц", included: true },
        { text: "Кастомный AI дисклеймер", included: true },
        { text: "Приоритетная поддержка", included: true }
      ]
    }
  ]
};

export default function LandingPage() {
  const { locale } = useLanguage();
  const t = copy[locale];

  return (
    <>
      <Navbar />
      <main className="bg-[var(--bg-page)] text-[var(--text-primary)]">
        <Hero t={t} />
        <StatsStrip stats={t.stats} />
        <Problem t={t} />
        <HowItWorks t={t} />
        <Features locale={locale} title={t.featuresTitle} eyebrow={t.featuresEyebrow} />
        <CaseScenarios locale={locale} />
        <Testimonials locale={locale} title={t.testimonialsTitle} eyebrow={t.testimonialsEyebrow} />
        <Pricing locale={locale} t={t} />
        <Trust t={t} />
        <CtaBanner t={t} />
      </main>
      <Footer />
    </>
  );
}

function Hero({ t }: { t: typeof copy.en }) {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40">
      <div className="pointer-events-none absolute left-1/2 top-40 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-10 blur-[70px]" />
      <div className="container-shell grid items-center gap-14 lg:grid-cols-[1fr_0.92fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-page)] px-4 py-2 text-sm text-[var(--text-secondary)] shadow-[var(--shadow-sm)]">
            <Shield className="h-4 w-4 text-[var(--green)]" />
            {t.heroBadge}
          </div>
          <h1 className="text-hero max-w-4xl">{t.heroTitle}</h1>
          <p className="text-body-lg mt-6 max-w-2xl text-[var(--text-secondary)]">
            {t.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <NextLink href="/auth/signup">
              <Button size="lg">
                {t.heroCta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </NextLink>
            <NextLink href="#features">
              <Button size="lg" variant="outline">{t.heroSecondary}</Button>
            </NextLink>
          </div>
          <div className="mt-8 grid gap-3 text-sm text-[var(--text-secondary)] sm:grid-cols-3">
            {t.heroChecks.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--green)]" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="relative mx-auto mt-8 w-full max-w-[500px] sm:mt-0">
          <div className="absolute -left-1 -top-9 z-10 rounded-full border border-[var(--border)] bg-[var(--bg-page)] px-3 py-1.5 text-[11px] font-semibold text-[var(--green)] shadow-[var(--shadow-md)] sm:-left-5 sm:-top-5 sm:text-xs">
            ✓ GDPR compliant
          </div>
          <div className="absolute -bottom-5 right-3 z-10 rounded-full border border-[var(--border)] bg-[var(--bg-page)] px-3 py-1.5 text-[11px] font-semibold text-[var(--accent)] shadow-[var(--shadow-md)] sm:-right-2 sm:text-xs">
            ⚡ 28 seconds
          </div>
          <MockReportCard />
        </div>
      </div>
    </section>
  );
}

function MockReportCard() {
  return (
    <div className="card relative overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--bg-page)] shadow-[var(--shadow-lg)]">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] p-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-light)]">
            <FileText size={14} className="text-[var(--accent)]" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold">Service Agreement.pdf</p>
            <p className="truncate text-[11px] text-[var(--text-muted)]">12 pages · Analyzed just now</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[var(--red-light)] px-2 py-0.5 text-[11px] font-medium text-[var(--red)]">
          2 High Risks
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 border-b border-[var(--border)] p-4">
        {[
          ["2", "High risks", "var(--red)"],
          ["3", "Medium risks", "var(--amber)"],
          ["8", "OK clauses", "var(--green)"]
        ].map(([value, label, color]) => (
          <div key={label} className="text-center">
            <div className="text-[22px] font-bold" style={{ color }}>{value}</div>
            <div className="text-[10px] text-[var(--text-muted)]">{label}</div>
          </div>
        ))}
      </div>
      <div className="space-y-2 p-4">
        <MockRisk icon={AlertTriangle} bg="var(--red-light)" color="var(--red)" title="Auto-renewal clause" text="Renews automatically for 12 months unless cancelled 60 days prior" />
        <MockRisk icon={AlertCircle} bg="var(--amber-light)" color="var(--amber)" title="Broad indemnity" text="You indemnify vendor for ALL third-party claims — no cap" />
        <MockRisk icon={CheckCircle} bg="var(--green-light)" color="var(--green)" title="Payment terms" text="Clear 30-day NET schedule with no hidden fees" />
      </div>
      <div className="mx-4 mb-4 rounded-lg border border-[color:var(--accent)]/20 bg-[var(--accent-light)] p-3">
        <p className="mb-1 text-[11px] font-semibold text-[var(--accent)]">💡 Negotiation suggestion</p>
        <p className="text-[11px] leading-relaxed text-[var(--text-secondary)]">
          Add: "Liability shall not exceed fees paid in the 3 months prior to the claim."
        </p>
      </div>
    </div>
  );
}

function MockRisk({
  icon: Icon,
  bg,
  color,
  title,
  text
}: {
  icon: typeof AlertTriangle;
  bg: string;
  color: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg p-2.5" style={{ background: bg }}>
      <Icon size={13} className="mt-0.5 shrink-0" style={{ color }} />
      <div>
        <p className="text-[12px] font-semibold" style={{ color }}>{title}</p>
        <p className="text-[11px] leading-relaxed text-[var(--text-secondary)]">{text}</p>
      </div>
    </div>
  );
}

function StatsStrip({ stats }: { stats: string[][] }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.25 });
  const numbers = [2400, 18, 28, 0];
  const suffixes = ["+", "", "s", ""];
  const prefixes = ["", "", "", "$"];

  return (
    <section ref={ref} className="border-y border-[var(--border)] py-12">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 text-center md:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={stat[1]}>
            <div className="font-display text-[36px] font-bold text-[var(--text-primary)]">
              {inView ? (
                <>
                  {prefixes[index]}
                  <CountUp end={numbers[index]} duration={1.5} separator="," />
                  {suffixes[index]}
                </>
              ) : (
                stat[0]
              )}
            </div>
            <div className="text-sm text-[var(--text-muted)]">{stat[1]}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Problem({ t }: { t: typeof copy.en }) {
  return (
    <section id="problem" className="bg-[var(--bg-surface)] py-20 md:py-28">
      <div className="container-shell">
        <p className="text-caption text-[var(--accent)]">{t.problemEyebrow}</p>
        <h2 className="text-h2 mt-3 max-w-3xl">{t.problemTitle}</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {t.problems.map((problem) => (
            <article key={problem} className="card rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-6 shadow-[var(--shadow-sm)]">
              <AlertTriangle className="h-7 w-7 text-[var(--red)]" />
              <h3 className="mt-6 font-display text-xl font-semibold">{problem}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ t }: { t: typeof copy.en }) {
  const isRu = t.howEyebrow.includes("Как");
  const [active, setActive] = useState<"analyze" | "build" | "strategize">("analyze");
  const modes = {
    analyze: {
      label: isRu ? "Анализ" : "Analyze",
      icon: FileSearch,
      steps: isRu
        ? [
            ["Загрузите договор", "PDF или DOCX, Lexo извлечёт текст и сохранит файл приватно."],
            ["Получите risk report", "AI покажет summary, риски, спорные пункты и jurisdiction."],
            ["Используйте playbook", "Получите готовые формулировки для переговоров и вопросы юристу."]
          ]
        : [
            ["Upload your contract", "PDF or DOCX, Lexo extracts text and stores the file privately."],
            ["Get a risk report", "AI shows summary, risks, unfavorable clauses, and jurisdiction."],
            ["Use the playbook", "Receive counter-language and smart questions for your lawyer."]
          ]
    },
    build: {
      label: isRu ? "Создание" : "Build",
      icon: FilePlus,
      steps: isRu
        ? [
            ["Опишите договор", "Напишите обычным языком: NDA, SaaS terms, employment, partnership."],
            ["AI уточнит детали", "Добавьте юрисдикцию, стороны, сроки и особые условия."],
            ["Скачайте черновик", "Получите полноценный договор с sections, placeholders и AI notes."]
          ]
        : [
            ["Describe the contract", "Use plain language: NDA, SaaS terms, employment, partnership."],
            ["AI clarifies details", "Add jurisdiction, parties, deadlines, and special terms."],
            ["Export the draft", "Get a structured contract with sections, placeholders, and AI notes."]
          ]
    },
    strategize: {
      label: isRu ? "Стратегия" : "Strategize",
      icon: Scale,
      steps: isRu
        ? [
            ["Опишите проблему", "Что случилось, какого результата хотите, на какой стадии дело."],
            ["AI исследует закон", "Lexo ищет применимые нормы, аргументы, риски и counter-arguments."],
            ["Получите case brief", "Экспортируйте brief своему юристу или подключите platform lawyer."]
          ]
        : [
            ["Describe the problem", "What happened, what outcome you want, and what stage it is at."],
            ["AI researches the law", "Lexo identifies statutes, arguments, risks, and counter-arguments."],
            ["Get a case brief", "Export it to your lawyer or connect with a platform lawyer."]
          ]
    }
  };
  const selected = modes[active];
  const SelectedIcon = selected.icon;

  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="container-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-caption text-[var(--accent)]">{t.howEyebrow}</p>
          <h2 className="text-h2 mt-3">{t.howTitle}</h2>
        </div>
        <div className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-1">
          {Object.entries(modes).map(([key, mode]) => (
            <button
              key={key}
              className={`rounded-xl px-3 py-3 text-sm font-semibold ${active === key ? "bg-[var(--accent)] text-white shadow-[var(--shadow-md)]" : "text-[var(--text-secondary)] hover:bg-[var(--bg-page)] hover:text-[var(--text-primary)]"}`}
              onClick={() => setActive(key as "analyze" | "build" | "strategize")}
              type="button"
            >
              {mode.label}
            </button>
          ))}
        </div>
        <div className="mt-10 grid items-stretch gap-6 rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:grid-cols-[0.9fr_1.1fr] md:p-8">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)]">
              <SelectedIcon className="h-7 w-7" />
            </div>
            <div className="mt-8 space-y-5">
              {selected.steps.map((step, index) => (
                <div key={step[0]} className="relative rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-5">
                  <span className="absolute right-5 top-3 font-display text-5xl font-extrabold text-[var(--accent)] opacity-10">
                    {index + 1}
                  </span>
                  <h3 className="font-display text-xl font-semibold">{step[0]}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{step[1]}</p>
                </div>
              ))}
            </div>
          </div>
          <ModeMock active={active} />
        </div>
      </div>
    </section>
  );
}

function ModeMock({ active }: { active: "analyze" | "build" | "strategize" }) {
  if (active === "build") {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-5 shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div>
            <p className="text-sm font-semibold">Mutual NDA draft</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Generated from plain language</p>
          </div>
          <span className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">Draft</span>
        </div>
        <div className="mt-5 space-y-3 font-serif text-sm leading-6 text-[var(--text-secondary)]">
          <p><span className="font-semibold text-[var(--text-primary)]">1. Parties.</span> This Agreement is entered into by [Company] and [Contractor].</p>
          <p><span className="font-semibold text-[var(--text-primary)]">2. Confidential Information.</span> Each party may disclose technical, customer, and business information.</p>
          <p><span className="font-semibold text-[var(--text-primary)]">3. Obligations.</span> Each party shall protect Confidential Information using reasonable care.</p>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          {["Governing law", "Signature block", "AI notes"].map((item) => (
            <div key={item} className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-3 text-xs font-medium text-[var(--text-secondary)]">
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (active === "strategize") {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-5 shadow-[var(--shadow-sm)]">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div>
            <p className="text-sm font-semibold">Case strategy brief</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Lawyer-ready summary</p>
          </div>
          <div className="rounded-xl bg-[var(--green-light)] px-3 py-2 text-center">
            <p className="text-[11px] font-semibold text-[var(--green)]">Position</p>
            <p className="text-sm font-bold text-[var(--green)]">Strong</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          {[
            ["Legal framework", "California Civil Code §1950.5"],
            ["Strongest argument", "Missed statutory deadline"],
            ["Next step", "Send demand letter before filing"]
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">{label}</p>
              <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">{value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <div>
          <p className="text-sm font-semibold">Service Agreement.pdf</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">Risk analysis complete</p>
        </div>
        <span className="rounded-full bg-[var(--red-light)] px-3 py-1 text-xs font-semibold text-[var(--red)]">2 High</span>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <MiniStat value="2" label="High" color="var(--red)" />
        <MiniStat value="3" label="Medium" color="var(--amber)" />
        <MiniStat value="8" label="OK" color="var(--green)" />
      </div>
      <div className="mt-5 space-y-2">
        {["Auto-renewal clause", "Broad indemnity", "Liability cap missing"].map((item) => (
          <div key={item} className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-3 text-sm text-[var(--text-secondary)]">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepMock({ index }: { index: number }) {
  if (index === 0) {
    return <div className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-page)] p-8 text-center text-sm text-[var(--text-secondary)]"><Upload className="mx-auto mb-3 h-8 w-8 text-[var(--accent)]" />Drop Service Agreement.pdf here</div>;
  }
  if (index === 1) {
    return <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-6"><p className="text-sm font-semibold">Reading clause 7 of 23...</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--bg-elevated)]"><div className="h-full w-2/3 rounded-full bg-[var(--accent)]" /></div></div>;
  }
  return <div className="grid grid-cols-3 gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-6 text-center"><MiniStat value="2" label="High" color="var(--red)" /><MiniStat value="3" label="Medium" color="var(--amber)" /><MiniStat value="8" label="OK" color="var(--green)" /></div>;
}

function MiniStat({ value, label, color }: { value: string; label: string; color: string }) {
  return <div><p className="font-display text-3xl font-bold" style={{ color }}>{value}</p><p className="text-xs text-[var(--text-muted)]">{label}</p></div>;
}

function Features({ locale, title, eyebrow }: { locale: "en" | "ru"; title: string; eyebrow: string }) {
  return (
    <section id="features" className="bg-[var(--bg-surface)] py-20 md:py-28">
      <div className="container-shell">
        <p className="text-caption text-[var(--accent)]">{eyebrow}</p>
        <h2 className="text-h2 mt-3 max-w-3xl">{title}</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {features[locale].map(([featureTitle, description, Icon, size]) => (
            <article key={featureTitle} className={`feature-card card rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-6 shadow-[var(--shadow-sm)] ${size === "large" ? "md:col-span-2" : ""}`}>
              <Icon className="h-7 w-7 text-[var(--accent)]" />
              <h3 className="mt-6 font-display text-xl font-semibold">{featureTitle}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseScenarios({ locale }: { locale: "en" | "ru" }) {
  const scenarios =
    locale === "ru"
      ? [
          { icon: Building2, title: "Арендодатель не возвращает депозит", result: "Lexo сослался на §1950.5, подготовил demand letter и предложил tenant rights lawyer.", outcome: "Депозит вернули за 11 дней" },
          { icon: ReceiptText, title: "Клиент отказывается платить", result: "Построен breach-of-contract аргумент, список доказательств и final notice.", outcome: "Оплата пришла без суда" },
          { icon: ClipboardCheck, title: "Non-compete после увольнения", result: "Проверена enforceability по штату, найден overreach, подготовлен counter-argument.", outcome: "Переход к конкуренту стал безопаснее" },
          { icon: Handshake, title: "Спор с сооснователем", result: "Проверен equity agreement, найден пробел в vesting schedule, подготовлена amendment strategy.", outcome: "Спор решён без суда" }
        ]
      : [
          { icon: Building2, title: "Landlord keeping your deposit", result: "Lexo cited §1950.5, drafted a demand letter, and matched a tenant rights lawyer.", outcome: "Deposit returned in 11 days" },
          { icon: ReceiptText, title: "Client refusing to pay", result: "Built breach-of-contract argument, identified invoice records needed, generated final notice.", outcome: "Payment received, no court" },
          { icon: ClipboardCheck, title: "Non-compete after leaving a job", result: "Analyzed enforceability by state, found overreach, prepared counter-argument.", outcome: "Joined competitor legally" },
          { icon: Handshake, title: "Co-founder dispute", result: "Reviewed equity agreement, identified missing vesting schedule, drafted amendment strategy.", outcome: "Dispute resolved without court" }
        ];

  return (
    <section className="py-20 md:py-28">
      <div className="container-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-caption text-[var(--accent)]">{locale === "ru" ? "Стратегия в действии" : "Case Strategist in action"}</p>
          <h2 className="text-h2 mt-3">
            {locale === "ru" ? "Не просто ответ. План действий." : "Not just an answer. A plan of action."}
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {scenarios.map(({ icon: Icon, title, result, outcome }) => (
            <article key={title} className="card rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-6 shadow-[var(--shadow-sm)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-light)] text-[var(--accent)]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{result}</p>
              <p className="mt-5 rounded-xl border border-[var(--green)]/15 bg-[var(--green-light)] p-3 text-sm font-semibold text-[var(--green)]">{outcome}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ locale, title, eyebrow }: { locale: "en" | "ru"; title: string; eyebrow: string }) {
  return (
    <section id="testimonials" className="py-20 md:py-28">
      <div className="container-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-caption text-[var(--accent)]">{eyebrow}</p>
          <h2 className="text-h2 mt-3">{title}</h2>
        </div>
        <div className="no-scrollbar mt-10 flex snap-x gap-4 overflow-x-auto md:grid md:grid-cols-3 md:overflow-visible">
          {testimonials[locale].map(([quote, name, titleText, initials, color]) => (
            <article key={name} className="card min-w-[300px] snap-center rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-6 shadow-[var(--shadow-sm)]">
              <div className="font-serif text-[80px] leading-none text-[var(--accent)] opacity-20">“</div>
              <p className="-mt-8 text-base italic leading-7 text-[var(--text-secondary)]">{quote}</p>
              <div className="mt-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: color }}>{initials}</span>
                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm text-[var(--text-muted)]">{titleText}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ locale, t }: { locale: "en" | "ru"; t: typeof copy.en }) {
  const [annual, setAnnual] = useState(false);
  const selectedPlans = useMemo(() => plans[locale], [locale]);

  return (
    <section id="pricing" className="bg-[var(--bg-surface)] py-20 md:py-28">
      <div className="container-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-caption text-[var(--accent)]">{t.pricingEyebrow}</p>
          <h2 className="text-h2 mt-3">{t.pricingTitle}</h2>
          <div className="mt-7 inline-flex rounded-xl border border-[var(--border)] bg-[var(--bg-page)] p-1 shadow-[var(--shadow-sm)]">
            <button className={`rounded-lg px-5 py-2 text-sm font-semibold ${!annual ? "bg-[var(--accent)] text-white" : "text-[var(--text-secondary)]"}`} onClick={() => setAnnual(false)}>
              {t.monthly}
            </button>
            <button className={`rounded-lg px-5 py-2 text-sm font-semibold ${annual ? "bg-[var(--accent)] text-white" : "text-[var(--text-secondary)]"}`} onClick={() => setAnnual(true)}>
              {t.annual} <span className="ml-1 text-xs opacity-75">{t.save20}</span>
            </button>
          </div>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {selectedPlans.map((plan) => {
            const price = annual ? plan.price.annual : plan.price.monthly;
            const annualSavings = (plan.price.monthly - plan.price.annual) * 12;
            return (
              <article
                key={plan.name}
                className={`pricing-card card relative rounded-2xl border p-6 shadow-[var(--shadow-sm)] ${plan.highlight ? "border-[var(--accent)] bg-[#0C0C0F] text-white dark:bg-[var(--accent-light)]" : plan.name === "Pro" ? "border-2 border-[var(--accent)] bg-[var(--bg-page)]" : "border-[var(--border)] bg-[var(--bg-page)]"}`}
              >
                {plan.badge && <span className="absolute right-5 top-5 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-white">{plan.badge}</span>}
                <h3 className="font-display text-2xl font-semibold">{plan.name}</h3>
                <p className={`mt-3 min-h-12 text-sm leading-6 ${plan.highlight ? "text-white/70" : "text-[var(--text-secondary)]"}`}>{plan.description}</p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="font-display text-5xl font-bold">${price}</span>
                  <span className={plan.highlight ? "pb-2 text-white/55" : "pb-2 text-[var(--text-muted)]"}>/mo</span>
                </div>
                {annual && annualSavings > 0 && <p className="mt-2 text-sm text-[var(--green)]">{t.saveYear} ${annualSavings}{t.perYear}</p>}
                <NextLink href="/auth/signup">
                  <Button className="mt-6 w-full" variant={plan.ctaStyle === "filled" ? "primary" : plan.highlight ? "dark" : "outline"}>{plan.cta}</Button>
                </NextLink>
                <ul className="mt-6 space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className={`flex gap-3 ${feature.included ? "" : plan.highlight ? "text-white/35" : "text-[var(--text-muted)]"}`}>
                      {feature.included ? <Check className="h-5 w-5 shrink-0 text-[var(--green)]" /> : <span className="mt-0.5 h-5 w-5 shrink-0 text-center text-[var(--text-muted)]">—</span>}
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Trust({ t }: { t: typeof copy.en }) {
  const isRu = t.trustEyebrow.includes("Доверие");
  const cards = isRu
    ? [
        ["Приватно по умолчанию", "Ваши файлы хранятся в приватном зашифрованном хранилище. Никто другой не получит доступ к договорам.", Lock, "green"],
        ["Всегда честно", "Каждый отчёт содержит понятный AI дисклеймер. Мы не утверждаем, что заменяем лицензированного юриста.", AlertTriangle, "accent"],
        ["AES-256 шифрование", "Данные шифруются при хранении и передаче. SOC2 Type II compliance in progress.", Shield, "amber"]
      ]
    : [
        ["Private by default", "Your files are stored in private encrypted storage. No one else can access your contracts. Ever.", Lock, "green"],
        ["Always honest", "Every report carries a clear AI disclaimer. We never claim to replace a licensed attorney.", AlertTriangle, "accent"],
        ["AES-256 encryption", "All data encrypted at rest and in transit. SOC2 Type II compliance in progress.", Shield, "amber"]
      ];

  return (
    <section id="trust" className="bg-[var(--bg-surface)] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <p className="mb-12 text-center text-[12px] font-medium uppercase tracking-widest text-[var(--text-muted)]">{t.trustEyebrow}</p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map(([title, description, Icon, tone]) => (
            <div key={title as string} className="card rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-6">
              <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${tone === "green" ? "bg-[var(--green-light)] text-[var(--green)]" : tone === "amber" ? "bg-[var(--amber-light)] text-[var(--amber)]" : "bg-[var(--accent-light)] text-[var(--accent)]"}`}>
                <Icon className="h-[18px] w-[18px]" />
              </div>
              <h3 className="mb-2 text-[15px] font-semibold">{title as string}</h3>
              <p className="text-[14px] leading-relaxed text-[var(--text-secondary)]">{description as string}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBanner({ t }: { t: typeof copy.en }) {
  return (
    <section className="border-y border-[#252528] bg-[#07070A] py-24">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="mb-4 text-[36px] font-bold leading-tight text-white md:text-[48px]">
          {t.ctaTitle}
        </h2>
        <p className="mb-8 text-[16px] leading-7 text-white/58">{t.ctaSubtitle}</p>
        <NextLink href="/auth/signup" className="button-like inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white hover:bg-[var(--accent-hover)]">
          {t.ctaButton}
          <ArrowRight size={16} />
        </NextLink>
        <p className="mt-4 text-[13px] text-white/42">{t.noCard}</p>
      </div>
    </section>
  );
}
