import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import "./styles/globals.css";
import "../themes/themes.css";

import { env } from "@/env.mjs";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers/providers";
import { ThemeWrapper } from "@/components/themes/theme-wrapper";
import { ThemeSwitcher } from "@/components/themes/theme-swticher";

const font = Montserrat({ subsets: ["latin"], weight: "500" });

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "black" }],
  keywords: [
    "Next.js",
    "Tailwind CSS",
    "NextAuth.js",
    "TypeScript",
    "Prisma",
    "shadcn/ui",
    "nextui.org",
    "Server Components",
    "Vercel",
    "Finance",
    "Expense Tracker",
    "Budget",
    "Money",
  ],
  authors: [
    {
      name: "Sukrit Saha",
      url: "https://github.com/Sukrittt",
    },
  ],
  creator: "Sukrittt",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@SukritSaha11",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn("bg-background antialiased", font.className)}>
        <Providers>
          <ThemeWrapper>
            <Toaster />
            {children}
          </ThemeWrapper>
          <ThemeSwitcher />
        </Providers>
      </body>
    </html>
  );
}
