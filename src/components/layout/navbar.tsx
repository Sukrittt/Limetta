import Link from "next/link";
import { Button } from "@nextui-org/button";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config";
import NavDropdown from "./nav-dropdown";
import { Icons } from "@/components/icons";
import { getAuthSession } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";

export const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className="sticky top-0 z-40 w-full bg-background flex justify-between items-center py-5 px-8 lg:px-24">
      <div className="relative z-20 flex items-center">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "link" }),
            "text-md tracking-tighter text-white pl-0"
          )}
        >
          <Icons.logo className="mr-2 h-6 w-6 fill-black dark:fill-white" />
          {siteConfig.name}
        </Link>
      </div>
      <div className="flex gap-x-4 items-center">
        {session ? (
          <NavDropdown session={session} />
        ) : (
          <Button
            className={cn(buttonVariants({ size: "sm" }), "rounded-full")}
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
