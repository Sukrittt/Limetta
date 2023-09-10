import { Button } from "@nextui-org/button";
import Link from "next/link";
import { Link as NextUILink } from "@nextui-org/link";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config";
import NavDropdown from "./nav-dropdown";
import { Icons } from "@/components/icons";
import { getAuthSession } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";

export const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className="sticky top-0 z-40 w-full bg-background flex justify-between lg:space-around items-center py-3 border-b px-8 lg:px-16">
      <div className="w-full lg:flex hidden gap-x-8 items-center">
        <div className="relative z-20 flex items-center">
          <NextUILink
            href="/"
            as={Link}
            className={cn(
              buttonVariants({ variant: "link" }),
              "text-md tracking-tighter text-white"
            )}
          >
            <Icons.logo className="mr-2 h-6 w-6  fill-black dark:fill-white" />
            {siteConfig.name}
          </NextUILink>
        </div>
      </div>
      <div className="flex gap-x-4 items-center">
        {session ? (
          <NavDropdown session={session} />
        ) : (
          <Button
            className={buttonVariants({ variant: "secondary" })}
            as={Link}
            href="/sign-in"
          >
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
};
