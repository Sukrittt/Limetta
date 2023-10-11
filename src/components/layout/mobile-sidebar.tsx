"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Divider } from "@nextui-org/divider";

import { Icons } from "@/components/icons";
import { Logout } from "@/components/logout";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/components/site-logo";
import { accounts, settings, siteConfig } from "@/config";
import { ThemeSelector } from "@/components/themes/theme-selector";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent xl:hidden"
        >
          <Icons.menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex flex-col gap-y-4 pl-3 w-[250px] md:w-[300px]"
      >
        <SiteLogo />

        <div className="space-y-4 tracking-tight pt-2">
          <div className="flex gap-x-2 items-center">
            <div className="h-3 w-3 rounded-sm bg-primary" />
            <h1 className="text-sm">Main menu</h1>
          </div>
          <div className="ml-4 flex flex-col gap-y-4 text-sm text-muted-foreground">
            {accounts.map((account, index) => (
              <Link
                className="hover:text-primary transition"
                href={account.href}
                key={index}
              >
                <div className="flex gap-x-2">
                  <account.Icon className="h-4 w-4" />
                  {account.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="space-y-4 tracking-tight">
          <div className="flex gap-x-2 items-center">
            <div className="h-3 w-3 rounded-sm bg-yellow-400" />
            <h1 className="text-sm">Account</h1>
          </div>
          <div className="ml-4 flex flex-col gap-y-4 text-sm text-muted-foreground">
            {settings.map((setting, index) => (
              <Link
                className="hover:text-primary transition"
                href={setting.href}
                key={index}
              >
                <div className="flex gap-x-2">
                  <setting.Icon className="h-4 w-4" />
                  {setting.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="pt-4 space-y-2">
          <Divider />
          <Logout />
        </div>

        <div className="absolute bottom-6">
          <ThemeSelector />
        </div>
      </SheetContent>
    </Sheet>
  );
};
