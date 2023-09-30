"use client";
import { useRouter } from "next/navigation";

import { Icons } from "@/components/icons";

export const GoBack = () => {
  const router = useRouter();

  return (
    <div className="border rounded-full absolute top-4 left-6 p-2">
      <Icons.back className="h-6 w-6" onClick={() => router.back()} />
      <span className="sr-only">Go Back</span>
    </div>
  );
};
