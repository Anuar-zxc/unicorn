import type { Metadata } from "next";
import { SellerTaxLanding } from "@/components/landing/SellerTaxLanding";

export const metadata: Metadata = {
  title: "Налоги продавца на Kaspi, Wildberries и Ozon",
  description:
    "Практический налоговый чек-лист для продавцов маркетплейсов в Казахстане: ИП, режим налогообложения, НДС, отчётность. Бесплатно за минуту.",
  alternates: { canonical: "/seller-tax" }
};

export default function SellerTaxLandingPage() {
  return <SellerTaxLanding />;
}
