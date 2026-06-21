"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Loader2, Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageModeToggle } from "@/components/shared/LanguageModeToggle";
import { useLanguage } from "@/components/providers/AppProviders";
import type { AILanguage } from "@/lib/ai-language";
import type { ContractTypeDefinition } from "@/lib/contract-types";

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
      if (!response.ok) throw new Error(data.error || "Could not start the drafting session.");
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
      if (!response.ok) throw new Error(data.error || "Could not continue drafting.");
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

  function downloadWord() {
    const blob = new Blob(
      [`<html><body><pre style="white-space:pre-wrap;font-family:Georgia">${escapeHtml(draft)}</pre></body></html>`],
      { type: "application/msword" }
    );
    downloadBlob(blob, `${contractType.id}.doc`);
  }

  function downloadText() {
    downloadBlob(new Blob([draft], { type: "text/plain;charset=utf-8" }), `${contractType.id}.txt`);
  }

  return (
    <main className="p-4 md:p-6">
      <div className="grid min-h-[calc(100vh-150px)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] lg:grid-cols-[420px_1fr]">
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
                    ? "bg-[var(--accent)] text-white"
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
            {error && <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}
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
                className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
                disabled={loading}
              />
              <Button onClick={sendAnswer} disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </section>

        <section className="overflow-y-auto bg-[var(--bg-page)] p-5 md:p-8">
          {draft ? (
            <article className="mx-auto max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-sm)] md:p-10">
              <div className="whitespace-pre-wrap font-serif text-sm leading-7 text-[var(--text-primary)]">{draft}</div>
              {isComplete && (
                <div className="mt-8 flex flex-wrap gap-3 border-t border-[var(--border)] pt-6">
                  <Button onClick={downloadText}><Download className="h-4 w-4" />{ru ? "Скачать" : "Download"}</Button>
                  <Button variant="outline" onClick={downloadWord}>{ru ? "Скачать Word" : "Download Word"}</Button>
                  {accountType === "individual" && (
                    <Button variant="outline"><ShieldCheck className="h-4 w-4" />{ru ? "Проверка юристом" : "Get a lawyer review"}</Button>
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

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char] || char));
}
