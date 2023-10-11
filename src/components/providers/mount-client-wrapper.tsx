"use client";
import { ReactNode, useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";

import { siteConfig } from "@/config";

export const MountClientWrapper = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-background grid place-items-center">
        <div className="flex gap-x-4 items-center text-muted-foreground">
          <Spinner color="default" size="sm" />
          <p className="text-xs font-bold tracking-tighter">
            {siteConfig.name}
          </p>
        </div>
      </div>
    );
  }

  return <div className="text-content">{children}</div>;
};
