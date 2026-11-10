import { LandingPage } from "@/components/landing/LandingPage";
import { FAQ } from "@/lib/faq";
import { getSiteUrl } from "@/lib/polar";

const siteUrl = getSiteUrl();

// Structured data so search engines can show rich results (FAQ, pricing).
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Lexo",
      url: siteUrl,
      logo: `${siteUrl}/icon.svg`
    },
    {
      "@type": "SoftwareApplication",
      name: "Lexo",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      inLanguage: ["ru", "en"],
      areaServed: { "@type": "Country", name: "Kazakhstan" },
      description:
        "Юридический AI для Казахстана: проверка договоров, ответы на правовые вопросы со ссылками на законы РК, конструктор договоров и налоговый чек-лист для продавцов.",
      offers: [
        { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
        { "@type": "Offer", name: "Solo", price: "19", priceCurrency: "USD" },
        { "@type": "Offer", name: "Firm", price: "59", priceCurrency: "USD" }
      ],
      publisher: { "@id": `${siteUrl}/#organization` }
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.ru.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a }
      }))
    }
  ]
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <LandingPage />
    </>
  );
}
