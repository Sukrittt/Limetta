import { siteConfig } from "@/config";
import { type MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    "",
    "/dashboard",
    "/savings",
    "/miscellaneous",
    "/investments",
    "/expense-tracker",
    "/overview",
    "/customize",
    "/onboarding",
    "/about",
    "/contact",
    "/help",
    "/terms",
    "/privacy",
    "/sign-in",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes];
}
