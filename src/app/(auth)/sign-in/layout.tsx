import Link from "next/link";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <div className="relative py-3 px-8 z-20 flex items-center">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "link" }),
            "text-md tracking-tighter text-white pl-0"
          )}
        >
          <Icons.logo className="mr-2 h-6 w-6 fill-black dark:fill-white" />
          {siteConfig.name}
        </Link>
      </div>
      <div className="grow">{children}</div>
    </div>
  );
}
