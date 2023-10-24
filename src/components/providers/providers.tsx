"use client";

import { useState } from "react";
import { httpBatchLink } from "@trpc/react-query";
import { NextUIProvider } from "@nextui-org/react";
import { Provider as JotaiProvider } from "jotai";
import { Adsense } from "@ctrl/react-adsense";

import { ThemeProvider } from "@/components/themes/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { trpc } from "@/trpc/client";
import superjson from "superjson";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
        },
      })
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/trpc`,
        }),
      ],
      transformer: superjson,
    })
  );

  return (
    <>
      <Adsense client="ca-pub-8448763122793144" slot="7259870550" />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <JotaiProvider>
              <NextUIProvider>{children}</NextUIProvider>
            </JotaiProvider>
          </QueryClientProvider>
        </trpc.Provider>
      </ThemeProvider>
    </>
  );
}
