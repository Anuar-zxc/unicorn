"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { Eye, EyeOff, Scale, UserRound } from "lucide-react";
import {
  createSupabaseBrowserClient,
  isSupabaseConfigured
} from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/AppProviders";

const authText = {
  en: {
    fullName: "Full name",
    company: "Firm name (optional)",
    email: "Email",
    password: "Password",
    wait: "Please wait...",
    signin: "Log in",
    signup: "Create account",
    reset: "Send reset link",
    resetSent: "Password reset email sent. Check your inbox.",
    signupSent: "Account created. You can sign in now.",
    google: "Continue with Google",
    divider: "or",
    configError: "Authentication is not configured yet. Add the Supabase environment variables.",
    invalidCredentials: "Incorrect email or password.",
    emailNotConfirmed: "Confirm your email before signing in.",
    chooseType: "How will you use Lexo?",
    chooseTypeHint: "Choose the workspace that fits you. You can change it later.",
    lawyer: "I'm a lawyer",
    lawyerHint: "Contract review, case research, drafting, and client work.",
    individual: "I'm an individual",
    individualHint: "Check a lease, employment offer, freelance deal, or seller taxes."
  },
  ru: {
    fullName: "Полное имя",
    company: "Название фирмы (необязательно)",
    email: "Email",
    password: "Пароль",
    wait: "Подождите...",
    signin: "Войти",
    signup: "Создать аккаунт",
    reset: "Отправить ссылку",
    resetSent: "Письмо для сброса пароля отправлено. Проверьте почту.",
    signupSent: "Аккаунт создан. Теперь можно войти.",
    google: "Продолжить с Google",
    divider: "или",
    configError: "Авторизация ещё не настроена. Добавьте переменные окружения Supabase.",
    invalidCredentials: "Неверный email или пароль.",
    emailNotConfirmed: "Подтвердите email перед входом.",
    chooseType: "Как вы будете использовать Lexo?",
    chooseTypeHint: "Выберите подходящее пространство. Позже его можно изменить.",
    lawyer: "Я юрист",
    lawyerHint: "Проверка договоров, правовой поиск, документы и работа с клиентами.",
    individual: "Я частное лицо",
    individualHint: "Проверка аренды, оффера, договора с заказчиком или налогов продавца."
  }
};

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.38a4.6 4.6 0 0 1-2 3.02v2.53h3.24c1.9-1.75 2.98-4.33 2.98-7.39Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.38l-3.24-2.53c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.76-5.6-4.13H3.06v2.61A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.4 13.92A6.02 6.02 0 0 1 6.08 12c0-.67.12-1.32.32-1.92V7.47H3.06A10 10 0 0 0 2 12c0 1.61.38 3.14 1.06 4.53l3.34-2.61Z" />
      <path fill="#EA4335" d="M12 5.95c1.47 0 2.79.5 3.83 1.5L18.7 4.6A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.94 5.47l3.34 2.61c.79-2.37 3-4.13 5.6-4.13Z" />
    </svg>
  );
}

function friendlyError(message: string, text: (typeof authText)["en"]) {
  if (/invalid login credentials/i.test(message)) return text.invalidCredentials;
  if (/email not confirmed/i.test(message)) return text.emailNotConfirmed;
  return message;
}

export function AuthForm({
  mode,
  next = "/dashboard",
  initialAccountType
}: {
  mode: "signin" | "signup" | "reset";
  next?: string;
  initialAccountType?: "lawyer" | "individual";
}) {
  const { locale } = useLanguage();
  const text = authText[locale];
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<"lawyer" | "individual" | null>(
    mode === "signup" ? initialAccountType ?? null : "individual"
  );

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!isSupabaseConfigured()) {
      setLoading(false);
      setError(text.configError);
      return;
    }

    const origin = window.location.origin;

    if (mode === "reset") {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/auth/update-password`
      });
      setLoading(false);
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setMessage(text.resetSent);
      return;
    }

    if (mode === "signin") {
      const { error: signinError } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (signinError) {
        setError(friendlyError(signinError.message, text));
        return;
      }
      const target = safeRedirectPath(next);
      if (target.startsWith("/api/")) {
        // Route handlers (e.g. checkout) need a full navigation, not an RSC fetch.
        window.location.assign(target);
        return;
      }
      router.replace(target);
      router.refresh();
      return;
    }

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/dashboard/onboarding`,
        data: {
          full_name: fullName,
          company,
          account_type: accountType ?? "individual"
        }
      }
    });
    setLoading(false);

    if (signupError) {
      setError(signupError.message);
      return;
    }

    if (data.session) {
      if (data.user) {
        await supabase
          .from("profiles")
          .update({ account_type: accountType ?? "individual" })
          .eq("id", data.user.id);
      }
      router.replace("/dashboard/onboarding");
      router.refresh();
      return;
    }

    const { error: signinAfterSignupError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (!signinAfterSignupError) {
      router.replace("/dashboard/onboarding");
      router.refresh();
      return;
    }

    setMessage(text.signupSent);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    if (!isSupabaseConfigured()) {
      setLoading(false);
      setError(text.configError);
      return;
    }
    const origin = window.location.origin;
    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
          mode === "signup" ? "/dashboard/onboarding" : next
        )}&account_type=${accountType ?? "individual"}`,
        queryParams: {
          access_type: "offline",
          prompt: "select_account"
        }
      }
    });
    if (googleError) {
      setLoading(false);
      setError(googleError.message);
    }
  };

  if (mode === "signup" && !accountType) {
    return (
      <div>
        <h2 className="font-display text-lg font-semibold">
          {text.chooseType}
        </h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {text.chooseTypeHint}
        </p>
        <div className="mt-6 grid gap-3">
          <button
            type="button"
            onClick={() => setAccountType("individual")}
            className="group cursor-pointer rounded-2xl border border-[var(--border-strong)] p-5 text-left transition-colors duration-150 hover:border-[var(--accent)] hover:bg-[var(--accent-light)]"
          >
            <span className="flex items-start gap-3">
              <UserRound className="mt-0.5 h-6 w-6 text-[var(--accent)]" aria-hidden />
              <span>
                <span className="block font-semibold">{text.individual}</span>
                <span className="mt-1 block text-sm leading-5 text-[var(--text-secondary)]">
                  {text.individualHint}
                </span>
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setAccountType("lawyer")}
            className="group cursor-pointer rounded-2xl border border-[var(--border-strong)] p-5 text-left transition-colors duration-150 hover:border-[var(--accent)] hover:bg-[var(--accent-light)]"
          >
            <span className="flex items-start gap-3">
              <Scale className="mt-0.5 h-6 w-6 text-[var(--accent)]" aria-hidden />
              <span>
                <span className="block font-semibold">{text.lawyer}</span>
                <span className="mt-1 block text-sm leading-5 text-[var(--text-secondary)]">
                  {text.lawyerHint}
                </span>
              </span>
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      {mode === "signup" && (
        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm">
          <span className="font-medium">
            {accountType === "lawyer" ? text.lawyer : text.individual}
          </span>
          <button
            type="button"
            onClick={() => setAccountType(null)}
            className="min-h-9 cursor-pointer font-semibold text-[var(--accent)] hover:underline"
          >
            {locale === "ru" ? "Изменить" : "Change"}
          </button>
        </div>
      )}
      {mode !== "reset" && (
        <>
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading}
            className="focus-ring flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-page)] text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-surface)]"
          >
            <GoogleIcon />
            {text.google}
          </button>
          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
            <span className="h-px flex-1 bg-[var(--border)]" />
            {text.divider}
            <span className="h-px flex-1 bg-[var(--border)]" />
          </div>
        </>
      )}
      {mode === "signup" && (
        <>
          <label className="block">
            <span className="text-sm font-medium">{text.fullName}</span>
            <input
              type="text"
              name="full-name"
              autoComplete="name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="input-base mt-2 h-12 px-4"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">{text.company}</span>
            <input
              type="text"
              name="company"
              autoComplete="organization"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              className="input-base mt-2 h-12 px-4"
            />
          </label>
        </>
      )}
      <label className="block">
        <span className="text-sm font-medium">{text.email}</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="input-base mt-2 h-12 px-4"
          required
        />
      </label>
      {mode !== "reset" && (
        <div>
          <label htmlFor="auth-password" className="text-sm font-medium">{text.password}</label>
          <div className="relative mt-2">
            <input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input-base h-12 pl-4 pr-12"
              aria-describedby={mode === "signup" ? "auth-password-hint" : undefined}
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? (locale === "ru" ? "Скрыть пароль" : "Hide password") : (locale === "ru" ? "Показать пароль" : "Show password")}
              aria-pressed={showPassword}
              className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
            </button>
          </div>
          {mode === "signup" && (
            <p id="auth-password-hint" className="mt-1.5 text-xs text-[var(--text-muted)]">
              {locale === "ru" ? "Минимум 8 символов." : "At least 8 characters."}
            </p>
          )}
        </div>
      )}
      {error && (
        <p role="alert" className="rounded-xl border border-red-500/30 bg-[var(--red-light)] p-3 text-sm text-[var(--red)]">{friendlyAuthError(error, locale)}</p>
      )}
      {message && (
        <p role="status" className="rounded-xl bg-[var(--green-light)] p-3 text-sm text-[var(--green)]">
          {message}
        </p>
      )}
      <Button size="lg" className="w-full" disabled={loading}>
        {loading
          ? text.wait
          : mode === "signin"
            ? text.signin
            : mode === "signup"
              ? text.signup
              : text.reset}
      </Button>
    </form>
  );
}

/** Supabase returns English technical messages; show something a person can act on. */
function friendlyAuthError(message: string, locale: "ru" | "en") {
  const ru = locale === "ru";
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) {
    return ru ? "Неверный email или пароль." : "Incorrect email or password.";
  }
  if (lower.includes("email not confirmed")) {
    return ru ? "Подтвердите email — мы отправили ссылку на вашу почту." : "Confirm your email — we sent you a link.";
  }
  if (lower.includes("already registered") || lower.includes("already exists")) {
    return ru ? "Аккаунт с этим email уже есть. Войдите или восстановите пароль." : "An account with this email already exists. Sign in or reset your password.";
  }
  if (lower.includes("password should be") || lower.includes("at least")) {
    return ru ? "Пароль слишком короткий: нужно минимум 8 символов." : "Password is too short: use at least 8 characters.";
  }
  if (lower.includes("rate limit") || lower.includes("too many")) {
    return ru ? "Слишком много попыток. Подождите минуту и попробуйте снова." : "Too many attempts. Wait a minute and try again.";
  }
  if (lower.includes("fetch") || lower.includes("network")) {
    return ru ? "Нет соединения с сервером. Проверьте интернет и попробуйте снова." : "Could not reach the server. Check your connection and retry.";
  }
  return message;
}
