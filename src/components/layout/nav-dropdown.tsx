"use client";
import { FC } from "react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Avatar } from "@nextui-org/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sidebarItems } from "@/config";
import { Icons } from "@/components/icons";

interface NavDropdownProps {
  session: Session;
}

const NavDropdown: FC<NavDropdownProps> = ({ session }) => {
  const { user } = session;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar
          src={session.user.image ?? ""}
          className="cursor-pointer"
          size="sm"
          isBordered
          showFallback
          name={session.user.name ?? ""}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-2">
        <div className="flex items-center justify-start gap-2 p-2 text-sm">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        {sidebarItems.map((item, index) => (
          <DropdownMenuItem key={index} asChild className="cursor-pointer">
            <a href={item.href}>
              <div className="flex items-center gap-x-2">
                <item.Icon className="h-4 w-4" />
                {item.label}
              </div>
            </a>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/sign-in`,
            });
          }}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-x-2">
            <Icons.logout className="h-4 w-4" />
            Log out
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavDropdown;
