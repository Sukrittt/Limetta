import Link from "next/link";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config";
import { Icons } from "@/components/icons";
import AuthForm from "@/components/forms/auth-form";
import { buttonVariants } from "@/components/ui/button";

const SignIn = () => {
  return (
    <div className="container relative min-h-[90vh] lg:min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "link" }),
              "text-lg font-medium text-white"
            )}
          >
            <Icons.logo className="mr-2 h-6 w-6" />
            {siteConfig.name}
          </Link>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {`Welcome to ${siteConfig.name}`}
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose your preferred sign in method
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
