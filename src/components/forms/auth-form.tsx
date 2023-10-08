"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Spinner } from "@nextui-org/spinner";

import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import { Button } from "@nextui-org/button";
import { buttonVariants } from "@/components/ui/button";

type LoadingState = "google" | "github";

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState<LoadingState | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading("google");

    try {
      await signIn("google");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading("github");

    try {
      await signIn("github");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="grid gap-y-4 tracking-tighter">
      <Button
        onClick={handleGoogleLogin}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "relative bg-transparent border"
        )}
        disabled={isLoading === "google"}
      >
        {isLoading === "google" ? (
          <Spinner color="default" size="sm" className="mr-2 absolute left-3" />
        ) : (
          <Icons.google className="h-5 w-5 absolute left-3" />
        )}{" "}
        Sign in with Google
      </Button>
      <Button
        onClick={handleGithubLogin}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "relative bg-transparent border"
        )}
        disabled={isLoading === "github"}
      >
        {isLoading === "github" ? (
          <Spinner color="default" size="sm" className="mr-2 absolute left-3" />
        ) : (
          <Icons.gitHub className="h-4 w-4 absolute left-3" />
        )}{" "}
        Sign in with Github
      </Button>
    </div>
  );
};

export default AuthForm;
