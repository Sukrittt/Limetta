import { ReactNode } from "react";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Card, CardContent } from "@/components/ui/card";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <div className="container flex-1 items-start lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-5">
        <Card className="mt-6 hidden lg:block">
          <CardContent className="pb-0">
            <aside className="-ml-2 w-full shrink-0 overflow-y-auto">
              <div className="py-6">
                <SidebarNav />
              </div>
            </aside>
          </CardContent>
        </Card>
        <div className="flex w-full flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
