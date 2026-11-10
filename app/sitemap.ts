import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/polar";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date("2026-11-11");
  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/seller-tax`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/ai-policy`, lastModified, changeFrequency: "yearly", priority: 0.3 }
  ];
}
