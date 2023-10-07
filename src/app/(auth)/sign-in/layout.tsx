import Link from "next/link";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <div className="relative py-8 px-12 z-20 flex items-center">
        <Link href="/" className="text-lg font-bold tracking-tight">
          <span className="text-primary">B</span>alance
          <span className="text-primary">W</span>ise
        </Link>
      </div>
      <div className="grow">{children}</div>
    </div>
  );
}
