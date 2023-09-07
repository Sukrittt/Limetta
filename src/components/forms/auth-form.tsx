"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

import { Icons } from "@/components/icons";
import { toast } from "@/hooks/use-toast";
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
    <div className="grid gap-y-4 w-full h-full">
      <Button
        onClick={handleGoogleLogin}
        className={buttonVariants({ variant: "outline" })}
        disabled={isLoading === "google"}
      >
        {isLoading === "google" ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
      <Button
        onClick={handleGithubLogin}
        className={buttonVariants({ variant: "outline" })}
        disabled={isLoading === "github"}
      >
        {isLoading === "github" ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        Github
      </Button>
    </div>
  );
};

export default AuthForm;
