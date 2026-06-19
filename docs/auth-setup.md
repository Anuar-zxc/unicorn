# Настройка авторизации Lexo

Приложение поддерживает:

- вход и регистрацию по email/паролю;
- подтверждение email;
- вход через Google;
- восстановление и установку нового пароля;
- возврат пользователя на изначально запрошенную страницу после входа.

## 1. Переменные окружения

Создайте `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Для production задайте `NEXT_PUBLIC_APP_URL` равным публичному HTTPS-домену:
`https://lexo-ai-kz.vercel.app`.

## 2. URL Configuration в Supabase

В Supabase Dashboard откройте **Authentication → URL Configuration**.

- Site URL для разработки: `http://localhost:3000`
- Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://ВАШ-ДОМЕН/auth/callback`

## 3. Email/Password

В **Authentication → Providers → Email** включите Email provider. Если включено
подтверждение email, пользователь после регистрации получает письмо и попадает
через `/auth/callback` в onboarding.

Шаблоны писем должны использовать стандартную переменную Supabase для ссылки
подтверждения/восстановления. Redirect URL передаётся приложением автоматически.

## 4. Google OAuth

1. В Google Cloud Console создайте OAuth 2.0 Client ID типа **Web application**.
2. В Authorized JavaScript origins добавьте:
   - `http://localhost:3000`
   - `https://ВАШ-ДОМЕН`
3. В Authorized redirect URIs добавьте callback Supabase:
   - `https://PROJECT_REF.supabase.co/auth/v1/callback`
4. В Supabase откройте **Authentication → Providers → Google**.
5. Включите provider и вставьте Google Client ID и Client Secret.

Важно: Google перенаправляет сначала в Supabase callback, а Supabase — в
`/auth/callback` приложения.

## 5. База данных

Выполните `supabase/schema.sql` в Supabase SQL Editor. Триггер
`handle_new_user` автоматически создаёт строку `profiles` как для email, так и
для Google-пользователей.

## 6. Проверка

```bash
npm run dev
```

Проверьте:

1. регистрацию по email и переход по письму;
2. обычный вход;
3. вход Google;
4. «Забыли пароль?» и установку нового пароля;
5. выход из dashboard.
