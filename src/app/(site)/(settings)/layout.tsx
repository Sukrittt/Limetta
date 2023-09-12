import { ReactNode } from "react";

import { SidebarNav } from "@/components/layout/sidebar-nav";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <div className="container flex-1 items-start lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-4.25rem)] w-full shrink-0 overflow-y-auto border-r lg:sticky lg:block">
          <div className="py-6 pr-6 lg:py-8">
            <SidebarNav />
          </div>
        </aside>
        <div className="flex w-full flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
