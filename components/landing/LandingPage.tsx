"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  FileDiff,
  FileSearch,
  FileText,
  Handshake,
  Home,
  LockKeyhole,
  MessageSquareText,
  ReceiptText,
  Scale,
  ShieldCheck,
  Sparkles,
  Store,
  Trash2,
  UserRound
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PricingTable } from "@/components/landing/PricingTable";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/AppProviders";
import { KNOWLEDGE_BASE } from "@/lib/site";

const copy = {
  ru: {
    badge: "Юридический AI для людей, бизнеса и юристов",
    hero: ["Понимайте право.", "Защищайте себя.", "Работайте увереннее."],
    lead: "Lexo объясняет договор до подписания, отвечает на юридические вопросы со ссылками на законы РК и помогает юристам быстрее проверять, исследовать и готовить документы.",
    primary: "Попробовать бесплатно",
    secondary: "Посмотреть, как работает",
    note: "Бесплатный план · Без банковской карты · Ответы на русском и английском",
    personal: ["Мне нужна помощь", "Проверить, спросить, создать"],
    lawyer: ["Я юрист", "Ускорить рабочий процесс"],
    demo: {
      file: "Договор_аренды_офиса_v4.pdf",
      pages: "12 страниц",
      done: "Анализ завершён",
      original: "Исходный договор",
      clauses: [
        ["5.2 Ответственность сторон", "Арендатор возмещает Арендодателю любые убытки, расходы и претензии третьих лиц…", "amber"],
        ["7.1 Срок действия", "Договор автоматически продлевается на каждые последующие 12 месяцев, если…", "red"]
      ],
      rest: ["8. Конфиденциальность", "Стороны обязуются не разглашать…"],
      report: "Отчёт о рисках",
      highRisks: "2 высоких риска",
      reportTitle: "Что важно знать до подписания",
      rows: [
        ["red", "Автопродление", "Отказ возможен только за 60 дней — легко пропустить срок и заплатить ещё за год."],
        ["amber", "Широкая ответственность", "Односторонняя обязанность возмещать любые убытки, без лимита."],
        ["green", "Конфиденциальность", "Взаимные и сбалансированные условия."]
      ],
      suggestion: "Предлагаемая редакция",
      suggestionText: "«Продление требует письменного согласия обеих сторон не позднее чем за 30 дней до окончания срока»."
    },
    stats: [
      [String(KNOWLEDGE_BASE.acts), "кодексов и законов РК из «Әділет» в базе знаний"],
      [KNOWLEDGE_BASE.articles.toLocaleString("ru-RU"), "статей, на которые Lexo ссылается в ответах"],
      [String(KNOWLEDGE_BASE.contractTypes), "типов договоров в пошаговом конструкторе"],
      ["~1 мин", "до готового разбора договора"]
    ],
    tasksEyebrow: "Один сервис — разные задачи",
    tasksTitle: "От личного вопроса до профессиональной юридической работы.",
    tasks: [
      "Разобраться в договоре аренды, работы, займа или услуг до подписания",
      "Задать юридический вопрос и получить понятный ответ со ссылками на статьи законов",
      "Собрать практичный договор в формате пошагового диалога",
      "Проверить обязанности продавца на маркетплейсе и следующие налоговые шаги",
      "Ускорить первичный анализ юридической команды, сохранив профессиональный контроль"
    ],
    featuresEyebrow: "Юридические инструменты без сложного языка",
    featuresTitle: "Начните с простой задачи. Lexo соберёт контекст и покажет следующие шаги.",
    features: [
      ["Понять любой договор", "Загрузите договор или фотографию. Lexo объяснит обязанности, риски, пропущенные условия и предложит формулировки правок.", "PDF · DOCX · сканы · фото"],
      ["Задать юридический вопрос", "Опишите ситуацию обычными словами и получите структурированный ответ со ссылками на конкретные статьи.", "Законы РК · ссылки на «Әділет»"],
      ["Собрать договор", "Ответьте на простые вопросы и получите понятный первый проект, который можно изменить и скачать.", "10 типов договоров"],
      ["Проверить налоги продавца", "Получите практический чек-лист по Казахстану с учётом площадки, оборота, регистрации и товара.", "Kaspi · Wildberries · Ozon"],
      ["Рабочее место юриста", "Исследования, подготовка документов и дел, резюме для клиента и история работы.", "Для частных юристов и команд"],
      ["Сравнить версии", "Узнайте, что изменилось между двумя редакциями документа и какие правки требуют внимания до согласования.", "Сравнение двух редакций"]
    ],
    audienceEyebrow: "Для жизни и работы",
    audienceTitle: "Полезно, даже если вы не юрист.",
    audience: [
      ["Для повседневных правовых вопросов", "Проверьте договор, разберитесь в своих правах, подготовьте соглашение или поймите, когда действительно нужен юрист."],
      ["Для фрилансеров и продавцов", "Проверяйте условия заказчиков, создавайте договоры услуг и разбирайтесь с налогами маркетплейса."],
      ["Для юристов и юридических команд", "Ускорьте первый этап проверки, исследований, подготовки, сравнения и общения с клиентом."]
    ],
    trustEyebrow: "Безопасность и контроль",
    trustTitle: "Ваши документы остаются вашими.",
    trust: [
      ["Приватное хранилище", "Файлы и отчёты доступны только вашему аккаунту — доступ ограничен на уровне базы данных."],
      ["Шифрование", "HTTPS при передаче и AES-256 при хранении у нашего облачного провайдера."],
      ["Без обучения на ваших данных", "Мы не используем ваши документы для обучения моделей."],
      ["Удаление в один клик", "Удалите любой отчёт вместе с исходным файлом прямо из истории."]
    ],
    finalTitle: "Правовые вопросы не должны начинаться с растерянности.",
    finalBody: "Lexo помогает понять ситуацию, подготовиться и выбрать следующий шаг — самостоятельно или вместе с юристом.",
    finalCta: "Начать бесплатно"
  },
  en: {
    badge: "Legal AI for people, businesses, and lawyers",
    hero: ["Understand the law.", "Protect your interests.", "Work with confidence."],
    lead: "Lexo explains a contract before you sign, answers legal questions with references to Kazakhstan law, and helps lawyers review, research, and draft faster.",
    primary: "Try Lexo free",
    secondary: "See how it works",
    note: "Free plan · No credit card · English and Russian answers",
    personal: ["I need legal help", "Check, ask, or create"],
    lawyer: ["I am a legal professional", "Accelerate legal work"],
    demo: {
      file: "Office_Lease_v4.pdf",
      pages: "12 pages",
      done: "Analysis complete",
      original: "Original contract",
      clauses: [
        ["5.2 Liability", "Tenant shall indemnify Landlord against any and all losses, costs, and third-party claims…", "amber"],
        ["7.1 Term", "This Agreement renews automatically for successive twelve-month periods unless…", "red"]
      ],
      rest: ["8. Confidentiality", "Each party shall maintain in confidence…"],
      report: "Risk report",
      highRisks: "2 high risks",
      reportTitle: "What to know before signing",
      rows: [
        ["red", "Auto-renewal", "Cancellation needs 60 days' notice — easy to miss and pay for another year."],
        ["amber", "Broad indemnity", "One-sided obligation to cover any loss, with no cap."],
        ["green", "Confidentiality", "Mutual and balanced."]
      ],
      suggestion: "Suggested revision",
      suggestionText: "“Renewal requires written consent of both parties at least 30 days before the term ends.”"
    },
    stats: [
      [String(KNOWLEDGE_BASE.acts), "Kazakhstan codes and laws from Adilet in the knowledge base"],
      [KNOWLEDGE_BASE.articles.toLocaleString("en-US"), "articles Lexo can cite in its answers"],
      [String(KNOWLEDGE_BASE.contractTypes), "contract types in the guided builder"],
      ["~1 min", "to a finished contract review"]
    ],
    tasksEyebrow: "One product, different needs",
    tasksTitle: "From a personal legal question to professional legal work.",
    tasks: [
      "Understand a rental, employment, loan, or service contract before signing",
      "Ask a legal question and get a clear answer that cites the actual articles",
      "Build a practical contract through a guided conversation",
      "Check marketplace seller obligations and likely tax next steps",
      "Give legal teams a faster first pass while keeping professional control"
    ],
    featuresEyebrow: "Legal tools without the legalese",
    featuresTitle: "Start with a simple task. Lexo gathers the context and shows the next steps.",
    features: [
      ["Understand any contract", "Upload a contract or photo. Lexo explains obligations, risks, and missing terms, and drafts replacement wording.", "PDF · DOCX · scans · photos"],
      ["Ask a legal question", "Describe the situation in plain language and get a structured answer citing specific articles.", "Kazakhstan law · Adilet references"],
      ["Build a contract", "Answer simple questions and get a clear first draft you can edit and download.", "10 contract types"],
      ["Seller tax check", "Get a practical Kazakhstan checklist based on your marketplace, revenue, registration, and products.", "Kaspi · Wildberries · Ozon"],
      ["Professional legal workspace", "Research, drafting, matter preparation, client summaries, and document history.", "For solo lawyers and teams"],
      ["Compare versions", "See what changed between two versions of a document and which edits deserve attention before you agree.", "Two-version comparison"]
    ],
    audienceEyebrow: "For life and work",
    audienceTitle: "Useful even when you are not a lawyer.",
    audience: [
      ["For everyday legal questions", "Check a contract, understand your rights, prepare an agreement, or decide when you really need a lawyer."],
      ["For freelancers and sellers", "Review client terms, create service agreements, and understand marketplace tax obligations."],
      ["For lawyers and legal teams", "Accelerate the first pass across review, research, drafting, redlines, and client communication."]
    ],
    trustEyebrow: "Security and control",
    trustTitle: "Your documents stay yours.",
    trust: [
      ["Private storage", "Files and reports are visible only to your account — enforced at the database level."],
      ["Encryption", "HTTPS in transit and AES-256 at rest with our cloud provider."],
      ["No training on your data", "We do not use your documents to train models."],
      ["One-click deletion", "Delete any report together with its source file right from history."]
    ],
    finalTitle: "Legal questions should not begin with confusion.",
    finalBody: "Lexo helps you understand the situation, prepare, and choose the next step — on your own or together with a lawyer.",
    finalCta: "Start free"
  }
};

const featureIcons = [FileSearch, MessageSquareText, FileText, ReceiptText, BriefcaseBusiness, FileDiff];
// 3-column bento: 2+1 / 1+2 / 1+2 — no empty cells.
const featureSpans = ["md:col-span-2", "", "", "md:col-span-2", "", "md:col-span-2"];
const audienceIcons = [UserRound, Store, Scale];
const trustIcons = [LockKeyhole, ShieldCheck, BookOpenCheck, Trash2];

export function LandingPage() {
  const { locale } = useLanguage();
  const ru = locale === "ru";
  const t = copy[locale];
  const [open, close] = ru ? ["«", "»"] : ["“", "”"];

  return (
    <>
      <Navbar />
      <main id="main">
        <section className="relative overflow-hidden border-b border-[var(--border)] pb-20 pt-32 md:pb-28 md:pt-40">
          <div className="absolute inset-0 -z-20 grid-bg opacity-50" />
          <div className="absolute left-[8%] top-24 -z-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="absolute right-[4%] top-36 -z-10 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="container-shell grid grid-cols-1 items-center gap-14 lg:grid-cols-[0.94fr_1.06fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-page)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-sm)]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden />
                {t.badge}
              </div>
              <h1 className="mt-7 font-display text-[clamp(38px,4.6vw,58px)] font-bold leading-[1.04] tracking-[-0.045em]">
                {t.hero[0]}<br />
                {t.hero[1]}<br />
                <span className="text-[var(--accent)]">{t.hero[2]}</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">{t.lead}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/auth/signup">{t.primary} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#demo">{t.secondary}</Link>
                </Button>
              </div>
              <p className="mt-5 text-xs text-[var(--text-muted)]">{t.note}</p>
              <div className="mt-8 grid grid-cols-1 max-w-xl gap-3 sm:grid-cols-2">
                <Link href="/auth/signup?account=individual" className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-page)]/80 p-4 shadow-[var(--shadow-sm)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[var(--accent)]">
                  <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-[var(--accent-light)] p-2 text-[var(--accent)]"><Home className="h-5 w-5" aria-hidden /></span>
                    <div><p className="text-sm font-semibold">{t.personal[0]}</p><p className="mt-0.5 text-xs text-[var(--text-muted)]">{t.personal[1]}</p></div>
                  </div>
                </Link>
                <Link href="/auth/signup?account=lawyer" className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-page)]/80 p-4 shadow-[var(--shadow-sm)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[var(--accent)]">
                  <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500"><BriefcaseBusiness className="h-5 w-5" aria-hidden /></span>
                    <div><p className="text-sm font-semibold">{t.lawyer[0]}</p><p className="mt-0.5 text-xs text-[var(--text-muted)]">{t.lawyer[1]}</p></div>
                  </div>
                </Link>
              </div>
            </div>

            <div id="demo" className="scroll-mt-28 rounded-2xl border border-[#2b2f3a] bg-[#0b0d12] p-3 shadow-[0_30px_80px_rgba(15,23,42,.22)]" aria-label={ru ? "Пример отчёта Lexo" : "Sample Lexo report"}>
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 pb-3 text-xs text-white/45">
                <span className="truncate">{t.demo.file} · {t.demo.pages}</span>
                <span className="flex shrink-0 items-center gap-2 text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />{t.demo.done}</span>
              </div>
              <div className="grid grid-cols-1 min-h-[430px] gap-3 pt-3 md:grid-cols-[1fr_1fr]">
                <div className="rounded-xl bg-[#151820] p-5 text-sm leading-7 text-white/65">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[.16em] text-white/35">{t.demo.original}</p>
                  {t.demo.clauses.map(([heading, body, tone], index) => (
                    <div key={heading} className={index ? "mt-5" : ""}>
                      <p>{heading}</p>
                      <p className={`mt-3 rounded-md border-l-2 px-3 py-2 text-white/85 ${tone === "red" ? "border-red-400 bg-red-400/10" : "border-amber-400 bg-amber-400/10"}`}>{body}</p>
                    </div>
                  ))}
                  <p className="mt-5 text-white/35">{t.demo.rest[0]}</p>
                  <p className="mt-2 text-white/25">{t.demo.rest[1]}</p>
                </div>
                <div className="rounded-xl bg-white p-5 text-[#111827]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#667085]">{t.demo.report}</p>
                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">{t.demo.highRisks}</span>
                  </div>
                  <h2 className="mt-5 font-display text-xl font-semibold">{t.demo.reportTitle}</h2>
                  <div className="mt-5 space-y-3">
                    {t.demo.rows.map(([tone, title, text]) => (
                      <ReportRow key={title} tone={tone as "red" | "amber" | "green"} title={title} text={text} />
                    ))}
                  </div>
                  <div className="mt-5 rounded-lg bg-[#f4f6fa] p-4">
                    <p className="text-xs font-bold uppercase tracking-[.12em] text-[#667085]">{t.demo.suggestion}</p>
                    <p className="mt-2 text-sm leading-6">{t.demo.suggestionText}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--border)] bg-[#0d1424] py-10 text-white">
          <dl className="container-shell grid grid-cols-2 gap-7 md:grid-cols-4">
            {t.stats.map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-3xl font-bold">{value}</dd>
                <dd className="mt-1 text-sm leading-5 text-white/60">{label}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="for-firms" className="py-20 md:py-28">
          <div className="container-shell">
            <p className="text-caption text-[var(--accent)]">{t.tasksEyebrow}</p>
            <div className="mt-3 grid grid-cols-1 gap-10 lg:grid-cols-[.8fr_1.2fr]">
              <h2 className="font-display text-[clamp(28px,3.4vw,42px)] font-bold leading-[1.1] tracking-[-0.03em]">{t.tasksTitle}</h2>
              <ol className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
                {t.tasks.map((point, index) => (
                  <li key={point} className="flex gap-5 py-5">
                    <span className="font-display text-sm font-semibold text-[var(--accent)]" aria-hidden>0{index + 1}</span>
                    <p className="text-base font-medium">{point}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-24 bg-[var(--bg-surface)] py-20 md:py-28">
          <div className="container-shell">
            <div className="max-w-3xl">
              <p className="text-caption text-[var(--accent)]">{t.featuresEyebrow}</p>
              <h2 className="mt-3 font-display text-[clamp(28px,3.4vw,42px)] font-bold leading-[1.1] tracking-[-0.03em]">{t.featuresTitle}</h2>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
              {t.features.map(([title, description, detail], index) => {
                const Icon = featureIcons[index];
                return (
                  <article key={title} className={`rounded-xl border border-[var(--border)] bg-[var(--bg-page)] p-6 shadow-[var(--shadow-sm)] ${featureSpans[index]}`}>
                    <Icon className="h-6 w-6 text-[var(--accent)]" aria-hidden />
                    <h3 className="mt-8 font-display text-xl font-semibold">{title}</h3>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">{description}</p>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[.12em] text-[var(--text-muted)]">{detail}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="audience" className="scroll-mt-24 py-20 md:py-28">
          <div className="container-shell">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-caption text-[var(--accent)]">{t.audienceEyebrow}</p>
              <h2 className="mt-3 font-display text-[clamp(28px,3.4vw,42px)] font-bold leading-[1.1] tracking-[-0.03em]">{t.audienceTitle}</h2>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
              {t.audience.map(([role, quote], index) => {
                const Icon = audienceIcons[index];
                return (
                  <article key={role} className="rounded-xl border border-[var(--border)] p-6">
                    <Icon className="h-6 w-6 text-[var(--accent)]" aria-hidden />
                    <p className="mt-8 text-lg leading-7">{open}{quote}{close}</p>
                    <p className="mt-6 text-sm font-semibold text-[var(--text-secondary)]">{role}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <PricingTable />

        <section id="trust" className="scroll-mt-24 bg-[#0d1424] py-20 text-white md:py-24">
          <div className="container-shell grid grid-cols-1 gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-caption text-[#8fb0ff]">{t.trustEyebrow}</p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">{t.trustTitle}</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {t.trust.map(([title, text], index) => {
                const Icon = trustIcons[index];
                return (
                  <div key={title} className="rounded-xl border border-white/10 bg-white/[.04] p-5">
                    <Icon className="h-5 w-5 text-[#8fb0ff]" aria-hidden />
                    <p className="mt-5 font-semibold">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/60">{text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <FAQAccordion />

        <section className="border-t border-[var(--border)] py-20 text-center md:py-28">
          <div className="container-shell">
            <Handshake className="mx-auto mb-6 h-9 w-9 text-[var(--accent)]" aria-hidden />
            <h2 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-tight md:text-5xl">{t.finalTitle}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">{t.finalBody}</p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/auth/signup">{t.finalCta} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </Button>
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
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${colors[tone]}`} aria-hidden />
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs leading-5 text-[#667085]">{text}</p>
      </div>
    </div>
  );
}
