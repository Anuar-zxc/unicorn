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
  Handshake,
  Home,
  LockKeyhole,
  MessageSquareText,
  ReceiptText,
  Scale,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
  UserRound
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PricingTable } from "@/components/landing/PricingTable";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/AppProviders";

const stats = [
  ["2", "languages: English and Russian"],
  ["4+", "document and image formats"],
  ["10", "guided contract templates"],
  ["24/7", "legal guidance on demand"]
];
const statsRu = [["2", "языка: русский и английский"], ["4+", "формата документов и изображений"], ["10", "пошаговых шаблонов договоров"], ["24/7", "юридическая помощь по запросу"]];

const painPoints = [
  "Understand a rental, employment, loan, or service contract before signing",
  "Ask a legal question and get a clear answer with trusted-source references",
  "Build a practical contract through a guided conversation",
  "Check marketplace seller obligations and likely tax next steps",
  "Give legal teams a faster first pass while keeping professional control"
];
const painPointsRu = ["Разобраться в договоре аренды, работы, займа или услуг до подписания", "Задать юридический вопрос и получить понятный ответ со ссылками на источники", "Собрать практичный договор в формате пошагового диалога", "Проверить обязанности продавца на маркетплейсе и следующие налоговые шаги", "Ускорить первичный анализ юридической команды, сохранив профессиональный контроль"];

const features = [
  {
    title: "Understand any contract",
    description: "Upload a contract or photo. Lexo explains the obligations, risks, missing terms, and practical next steps.",
    detail: "PDF · DOCX · scans · photos",
    icon: FileSearch,
    className: "md:col-span-2"
  },
  {
    title: "Ask a legal question",
    description: "Describe the situation in plain language and receive a structured answer grounded in trusted sources.",
    detail: "RU & EN · source references",
    icon: MessageSquareText
  },
  {
    title: "Build a contract",
    description: "Answer simple questions and turn your agreement into a clear first draft you can edit and share.",
    detail: "10 guided contract types",
    icon: FileText
  },
  {
    title: "Seller tax check",
    description: "Get a practical Kazakhstan checklist based on your marketplace, revenue range, registration, and products.",
    detail: "Kaspi · Wildberries · Ozon",
    icon: ReceiptText,
    className: "md:col-span-2"
  },
  {
    title: "Professional legal workspace",
    description: "Research, drafting, matter preparation, client summaries, and document history for legal professionals.",
    detail: "Built for solo lawyers and teams",
    icon: BriefcaseBusiness
  },
  {
    title: "Compare versions",
    description: "See what changed between two documents and which revisions deserve attention before you agree.",
    detail: "Two-version redline analysis",
    icon: FileDiff
  }
];
const featuresRu = [
  { title: "Понять любой договор", description: "Загрузите договор или фотографию. Lexo объяснит обязанности, риски, пропущенные условия и следующие шаги.", detail: "PDF · DOCX · сканы · фото", icon: FileSearch, className: "md:col-span-2" },
  { title: "Задать юридический вопрос", description: "Опишите ситуацию обычными словами и получите структурированный ответ с опорой на доверенные источники.", detail: "RU и EN · ссылки на источники", icon: MessageSquareText },
  { title: "Собрать договор", description: "Ответьте на простые вопросы и получите понятный первый проект, который можно изменить и отправить.", detail: "10 пошаговых типов договоров", icon: FileText },
  { title: "Проверить налоги продавца", description: "Получите практический чек-лист по Казахстану с учётом площадки, оборота, регистрации и товара.", detail: "Kaspi · Wildberries · Ozon", icon: ReceiptText, className: "md:col-span-2" },
  { title: "Рабочее место юриста", description: "Исследования, подготовка документов и дел, резюме для клиента и история работы для профессионалов.", detail: "Для частных юристов и команд", icon: BriefcaseBusiness },
  { title: "Сравнить версии", description: "Узнайте, что изменилось в двух документах и какие правки требуют внимания до согласования.", detail: "Сравнение двух версий", icon: FileDiff }
];

const profiles = [
  {
    role: "For everyday legal questions",
    quote: "Check a contract, understand your rights, prepare an agreement, or decide when you really need a lawyer.",
    icon: UserRound
  },
  {
    role: "For freelancers and sellers",
    quote: "Review client terms, create service agreements, and understand marketplace tax obligations.",
    icon: Store
  },
  {
    role: "For lawyers and legal teams",
    quote: "Accelerate the first pass across review, research, drafting, redlines, and client communication.",
    icon: Scale
  }
];
const profilesRu = [
  { role: "Для повседневных правовых вопросов", quote: "Проверьте договор, разберитесь в своих правах, подготовьте соглашение или поймите, когда действительно нужен юрист.", icon: UserRound },
  { role: "Для фрилансеров и продавцов", quote: "Проверяйте условия клиентов, создавайте договоры услуг и разбирайтесь с налогами маркетплейса.", icon: Store },
  { role: "Для юристов и юридических команд", quote: "Ускорьте первый этап проверки, исследований, подготовки, сравнения и общения с клиентом.", icon: Scale }
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
          <div className="absolute inset-0 -z-20 grid-bg opacity-50" />
          <div className="absolute left-[8%] top-24 -z-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="absolute right-[4%] top-36 -z-10 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="container-shell grid items-center gap-14 lg:grid-cols-[0.94fr_1.06fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-page)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-sm)]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
                {ru ? "Юридический AI для людей, бизнеса и юристов" : "Legal AI for people, businesses, and lawyers"}
              </div>
              <h1 className="mt-7 font-display text-[clamp(46px,6.5vw,78px)] font-semibold leading-[0.98] tracking-[-0.055em]">
                {ru ? "Понимайте право." : "Understand the law."}<br />
                {ru ? "Защищайте себя." : "Protect your interests."}<br />
                <span className="text-[var(--accent)]">{ru ? "Работайте увереннее." : "Work with confidence."}</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
                {ru ? "Lexo помогает обычным людям понять договор и задать юридический вопрос, а профессионалам — быстрее проверять, исследовать и готовить документы." : "Lexo helps anyone understand a contract or ask a legal question, while giving professionals a faster way to review, research, and draft."}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/auth/signup">
                  <Button size="lg">{ru ? "Попробовать бесплатно" : "Try Lexo free"} <ArrowRight className="h-4 w-4" /></Button>
                </Link>
                <Link href="#demo">
                  <Button size="lg" variant="outline">{ru ? "Посмотреть, как работает" : "See how it works"}</Button>
                </Link>
              </div>
              <p className="mt-5 text-xs text-[var(--text-muted)]">
                {ru ? "Бесплатный план · Без банковской карты · Ответы на русском и английском" : "Free plan · No credit card · English and Russian answers"}
              </p>
              <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
                <Link href="/auth/signup" className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-page)]/80 p-4 shadow-[var(--shadow-sm)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[var(--accent)]">
                  <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-[var(--accent-light)] p-2 text-[var(--accent)]"><Home className="h-5 w-5" /></span>
                    <div><p className="text-sm font-semibold">{ru ? "Мне нужна помощь" : "I need legal help"}</p><p className="mt-0.5 text-xs text-[var(--text-muted)]">{ru ? "Проверить, спросить, создать" : "Check, ask, or create"}</p></div>
                  </div>
                </Link>
                <Link href="/auth/signup" className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-page)]/80 p-4 shadow-[var(--shadow-sm)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[var(--accent)]">
                  <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500"><BriefcaseBusiness className="h-5 w-5" /></span>
                    <div><p className="text-sm font-semibold">{ru ? "Я юрист" : "I am a legal professional"}</p><p className="mt-0.5 text-xs text-[var(--text-muted)]">{ru ? "Ускорить рабочий процесс" : "Accelerate legal work"}</p></div>
                  </div>
                </Link>
              </div>
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
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#667085]">{ru ? "Понятный отчёт о рисках" : "Plain-language risk report"}</p>
                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">{ru ? "2 высоких риска" : "2 high risks"}</span>
                  </div>
                  <h2 className="mt-5 font-display text-xl font-semibold">{ru ? "Что важно знать до подписания" : "What to know before signing"}</h2>
                  <div className="mt-5 space-y-3">
                    <ReportRow tone="red" title={ru ? "Автопродление" : "Auto-renewal"} text={ru ? "Срок отказа за 60 дней создаёт риск нежелательного продления." : "60-day cancellation window creates lock-in exposure."} />
                    <ReportRow tone="amber" title={ru ? "Широкое возмещение убытков" : "Broad indemnity"} text={ru ? "Односторонняя обязанность без ограничения ответственности." : "One-sided obligation with no liability cap."} />
                    <ReportRow tone="green" title={ru ? "Конфиденциальность" : "Confidentiality"} text={ru ? "Взаимные и сбалансированные условия." : "Mutual and within market range."} />
                  </div>
                  <div className="mt-5 rounded-lg bg-[#f4f6fa] p-4">
                    <p className="text-xs font-bold uppercase tracking-[.12em] text-[#667085]">{ru ? "Предлагаемая редакция" : "Suggested revision"}</p>
                    <p className="mt-2 text-sm leading-6">{ru ? "«Продление требует письменного подтверждения обеих сторон не позднее чем за 30 дней до окончания срока»." : "“Renewal requires written confirmation by both parties at least 30 days before expiration.”"}</p>
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
            <p className="text-caption text-[var(--accent)]">{ru ? "Один сервис — разные задачи" : "One product, different needs"}</p>
            <div className="mt-3 grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
              <h2 className="text-h2">{ru ? "От личного вопроса до профессиональной юридической работы." : "From a personal legal question to professional legal work."}</h2>
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
              <p className="text-caption text-[var(--accent)]">{ru ? "Юридические инструменты без сложного языка" : "Legal tools without the legalese"}</p>
              <h2 className="text-h2 mt-3">{ru ? "Начните с простой задачи. Lexo соберёт контекст и покажет следующие шаги." : "Start with a simple task. Lexo gathers the context and shows the next steps."}</h2>
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

        <section id="audience" className="scroll-mt-24 py-20 md:py-28">
          <div className="container-shell">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-caption text-[var(--accent)]">{ru ? "Для жизни и работы" : "For life and work"}</p>
              <h2 className="text-h2 mt-3">{ru ? "Полезно, даже если вы не юрист." : "Useful even when you are not a lawyer."}</h2>
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
            <Handshake className="mx-auto mb-6 h-9 w-9 text-[var(--accent)]" />
            <h2 className="mx-auto max-w-4xl font-display text-4xl font-semibold tracking-tight md:text-6xl">{ru ? "Правовые вопросы не должны начинаться с растерянности." : "Legal questions should not begin with confusion."}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">{ru ? "Lexo помогает понять ситуацию, подготовиться и принять следующий шаг — самостоятельно или вместе с юристом." : "Lexo helps you understand the situation, prepare, and choose the next step — on your own or together with a lawyer."}</p>
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
