import { Roboto } from "next/font/google";
import type { Metadata } from "next";

import "./styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const font = Roboto({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Balancewise",
  description: "Track your monthly expenses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
