"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { useConfig } from "@/hooks/use-config";
import { themes } from "@/themes";

interface SiteLogoProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export const SiteLogo = ({ className, ...props }: SiteLogoProps) => {
  const [config] = useConfig();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const selectedTheme = themes.find((theme) => theme.name === config.theme)!;

  if (!mounted) {
    return (
      <Link
        href="/"
        className={cn(
          "text-xl font-bold tracking-tight group hover:text-primary focus:text-primary transition focus:outline-none",
          className
        )}
        {...props}
      >
        Limetta
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={cn(
        "text-xl font-bold tracking-tight group hover:text-primary focus:text-primary transition focus:outline-none",
        className
      )}
      {...props}
    >
      <Icons.siteLogo
        primaryColor={`hsl(${selectedTheme?.cssVars["dark"]["primary"]})`}
        secondaryColor="#423f3e"
        textColor={`hsl(${selectedTheme?.cssVars["dark"]["primary"]})`}
        className={cn("h-8", className)}
      />
    </Link>
  );
};
