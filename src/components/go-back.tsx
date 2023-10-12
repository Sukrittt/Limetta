"use client";
import { usePathname, useRouter } from "next/navigation";

import { Icons } from "@/components/icons";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

export const GoBack = () => {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/dashboard" || pathname === "/expense-tracker") return;

  return (
    <div className="flex xl:hidden justify-between items-center">
      <div className="border rounded-xl relative h-9 w-9">
        <Icons.left
          className="h-6 w-6 absolute left-1 top-1.5"
          onClick={() => router.back()}
        />
        <span className="sr-only">Go Back</span>
      </div>
      <MobileSidebar />
    </div>
  );
};
