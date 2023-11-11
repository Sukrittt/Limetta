import Link from "next/link";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";

import { cn } from "@/lib/utils";
import { SiteLogo } from "@/components/site-logo";
import { getAuthSession } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";

export const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className="sticky top-0 z-40 w-full bg-background flex justify-between items-center py-5 px-8 lg:px-24">
      <div className="relative z-20 flex items-center">
        <SiteLogo className="h-6 md:h-8" />
      </div>
      <div className="flex gap-x-4 items-center">
        {session ? (
          <Avatar
            src={session.user.image ?? ""}
            size="sm"
            showFallback
            name={session.user.name ?? ""}
          />
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
