"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Copy, Download, FileDown, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageModeToggle } from "@/components/shared/LanguageModeToggle";
import { useLanguage } from "@/components/providers/AppProviders";
import type { AILanguage } from "@/lib/ai-language";
import type { ContractTypeDefinition } from "@/lib/contract-types";
import { Markdown } from "@/components/shared/Markdown";
import { copyToClipboard, downloadMarkdown, downloadWord as exportWord } from "@/lib/export";

type Message = { role: "assistant" | "user"; content: string };

export function ContractWizard({
  contractType,
  accountType,
  initialLanguage
}: {
  contractType: ContractTypeDefinition;
  accountType: "lawyer" | "individual";
  initialLanguage: AILanguage;
}) {
  const { locale } = useLanguage();
  const ru = locale === "ru";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [draft, setDraft] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [language, setLanguage] = useState<AILanguage>(
    initialLanguage === "ru" ? "ru" : locale
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const storageKey = `lexo-draft-session:${accountType}:${contractType.id}`;

  useEffect(() => {
    const savedSessionId = window.localStorage.getItem(storageKey);
    void startConversation(savedSessionId);
    // The contract identity is stable for the lifetime of this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function startConversation(resumeSessionId: string | null) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/draft-wizard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          contractTypeId: contractType.id,
          accountType,
          language,
          sessionId: resumeSessionId
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(friendlyError(data.error, response.status, ru));
      setSessionId(data.sessionId);
      window.localStorage.setItem(storageKey, data.sessionId);
      setMessages(data.conversation?.length ? data.conversation : [{ role: "assistant", content: data.firstQuestion }]);
      setDraft(data.draft || "");
      setIsComplete(data.isComplete || false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not start the drafting session.");
    } finally {
      setLoading(false);
    }
  }

  async function sendAnswer() {
    const answer = input.trim();
    if (!answer || !sessionId || loading) return;
    const nextMessages: Message[] = [...messages, { role: "user", content: answer }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/draft-wizard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "continue",
          sessionId,
          answer,
          language
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(friendlyError(data.error, response.status, ru));
      if (data.draft) setDraft(data.draft);
      setIsComplete(Boolean(data.isComplete));
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: data.message || data.nextQuestion
        }
      ]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not continue drafting.");
    } finally {
      setLoading(false);
    }
  }

  const draftTitle = ru ? contractType.name_ru : contractType.name;

  function downloadWord() {
    exportWord(draftTitle, draftRef.current?.innerHTML ?? "");
  }

  function downloadText() {
    downloadMarkdown(draftTitle, draft);
  }

  async function copyDraft() {
    if (await copyToClipboard(draft)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <main className="p-4 md:p-6">
      <div className="grid grid-cols-1 min-h-[calc(100vh-150px)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] lg:grid-cols-[420px_1fr]">
        <section className="flex min-h-[680px] flex-col border-b border-[var(--border)] lg:border-b-0 lg:border-r">
          <header className="border-b border-[var(--border)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[.14em] text-[var(--text-muted)]">
                  {accountType === "lawyer"
                    ? ru ? "Профессиональная подготовка" : "Professional drafting"
                    : ru ? "Пошаговый конструктор" : "Guided builder"}
                </p>
                <h1 className="mt-1 font-display text-lg font-semibold">
                  {locale === "ru" ? contractType.name_ru : contractType.name}
                </h1>
              </div>
              <LanguageModeToggle language={language} onChange={setLanguage} />
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "bg-[var(--accent-solid)] text-[var(--on-accent)]"
                    : "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl bg-[var(--bg-elevated)] px-4 py-3">
                  {[0, 1, 2].map((item) => <span key={item} className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--text-muted)]" style={{ animationDelay: `${item * 150}ms` }} />)}
                </div>
              </div>
            )}
            {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-[var(--red)]">{error}</p>}
            <div ref={scrollRef} />
          </div>

          {!isComplete && (
            <div className="flex gap-2 border-t border-[var(--border)] p-4">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void sendAnswer();
                }}
                placeholder={ru ? "Введите ответ…" : "Type your answer…"}
                aria-label={ru ? "Ваш ответ" : "Your answer"}
                className="input-base h-12 min-w-0 flex-1 px-4"
                disabled={loading}
              />
              <Button onClick={sendAnswer} disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" aria-hidden />
                <span className="sr-only">{ru ? "Отправить" : "Send"}</span>
              </Button>
            </div>
          )}
        </section>

        <section className="overflow-y-auto bg-[var(--bg-page)] p-5 md:p-8">
          {draft ? (
            <article className="mx-auto max-w-3xl rounded-lg border border-[var(--border)] bg-[var(--bg-page)] p-6 shadow-[var(--shadow-md)] md:px-14 md:py-12">
              <Markdown ref={draftRef} className="lexo-doc">{draft}</Markdown>
              {isComplete && (
                <div className="mt-8 flex flex-wrap gap-3 border-t border-[var(--border)] pt-6">
                  <Button onClick={downloadWord}><FileDown className="h-4 w-4" />{ru ? "Скачать Word" : "Download Word"}</Button>
                  <Button variant="outline" onClick={downloadText}><Download className="h-4 w-4" />Markdown</Button>
                  <Button variant="outline" onClick={() => void copyDraft()}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? (ru ? "Скопировано" : "Copied") : ru ? "Копировать" : "Copy"}
                  </Button>
                  {accountType === "individual" && (
                    <Button asChild variant="ghost">
                      <Link href="/dashboard/ask">{ru ? "Задать вопрос по договору" : "Ask about this contract"}</Link>
                    </Button>
                  )}
                </div>
              )}
            </article>
          ) : (
            <div className="grid min-h-[620px] place-items-center text-center text-sm text-[var(--text-muted)]">
              {ru ? "Договор появится здесь по мере заполнения →" : "Your contract will appear here as we build it together →"}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function friendlyError(raw: unknown, status: number, ru: boolean) {
  const message = typeof raw === "string" ? raw : "";
  if (status === 403 || message.includes("PLAN_LIMIT")) {
    return ru
      ? "Лимит договоров на этот месяц исчерпан. Обновите тариф в разделе «Оплата»."
      : "You have used this month's contract builds. Upgrade in Billing to continue.";
  }
  if (status === 401) return ru ? "Сессия истекла. Войдите снова." : "Your session expired. Please sign in again.";
  return ru ? "Не удалось продолжить. Попробуйте ещё раз." : "Could not continue. Please try again.";
}
