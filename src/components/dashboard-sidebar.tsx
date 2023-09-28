"use client";

import Link from "next/link";
import { Session } from "next-auth";

import { accounts, settings, siteConfig } from "@/config";
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

      <div className="space-y-4 tracking-tight">
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
    </div>
  );
};
