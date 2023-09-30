"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { Spinner } from "@nextui-org/spinner";
import { Button } from "@nextui-org/button";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";

export const Logout = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    signOut({
      callbackUrl: `${window.location.origin}/sign-in`,
    });
  };

  return (
    <Button
      className={cn(
        buttonVariants({ variant: "secondary" }),
        "rounded-xl shadow-xl w-full"
      )}
      disabled={loading}
      onClick={handleLogout}
    >
      {loading ? (
        <Spinner color="default" size="sm" className="mr-2" />
      ) : (
        <Icons.logout className="h-4 w-4" />
      )}
      {loading ? "Logging out" : "Log out"}
    </Button>
  );
};
