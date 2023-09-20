"use client";

import Link from "next/link";
import { Session } from "next-auth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { dashboardItems, siteConfig } from "@/config";
import NavDropdown from "@/components/layout/nav-dropdown";

export const DashboardSidebar = ({ session }: { session: Session }) => {
  return (
    <div className="flex flex-col gap-y-8 px-5 pb-8 pt-6 md:py-8">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-lg font-medium tracking-tight">
          {siteConfig.name}
        </Link>
        <NavDropdown session={session} />
      </div>

      <Accordion type="single" collapsible className="w-full">
        {dashboardItems.map((accItem, index) => (
          <AccordionItem key={index} value={`${index + 1}`}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex gap-x-2 items-center text-sm hover:text-primary transition">
                <accItem.Icon className="h-4 w-4 text-muted-foreground" />{" "}
                {accItem.title}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-y-4 text-sm">
                {accItem.subItems.map((subItem, index) => (
                  <Link
                    key={index}
                    className="hover:text-primary transition"
                    href={subItem.href}
                  >
                    <div className="flex gap-x-2 items-center">
                      <subItem.Icon className="text-muted-foreground h-4 w-4" />{" "}
                      {subItem.title}
                    </div>
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
