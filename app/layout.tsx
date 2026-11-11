import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { getSiteUrl } from "@/lib/polar";

// Both fonts ship Cyrillic glyphs — the old display font had none, so every
// Russian heading silently fell back to the system font.
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  display: "swap"
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  display: "swap"
});

const siteUrl = getSiteUrl();
const title = "Lexo — юридический AI для Казахстана";
const description =
  "Проверьте договор до подписания, задайте юридический вопрос и соберите договор за минуты. Lexo опирается на законы РК из «Әділет», отвечает на русском и английском. Бесплатный план без карты.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s — Lexo"
  },
  description,
  applicationName: "Lexo",
  keywords: [
    "юридический AI",
    "проверка договора",
    "юрист онлайн Казахстан",
    "договор аренды Казахстан",
    "налоги продавца Kaspi",
    "AI для юристов",
    "legal AI Kazakhstan",
    "contract review"
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_KZ",
    alternateLocale: ["en_US"],
    url: "/",
    siteName: "Lexo",
    title,
    description
  },
  twitter: {
    card: "summary_large_image",
    title,
    description
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0f" }
  ]
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--accent-solid)] focus:px-4 focus:py-2 focus:text-white"
        >
          Перейти к содержанию
        </a>
        <AppProviders>{children}</AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
