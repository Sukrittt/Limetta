import Link from "next/link";
import { Metadata } from "next";

import { env } from "@/env.mjs";
import { SiteLogo } from "@/components/site-logo";
import AuthForm from "@/components/forms/auth-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "Sign in",
  description:
    "Sign in to access your financial dashboard. Manage your expenses, track savings, and stay in control of your finances with our user-friendly sign-in page.",
};

const SignIn = () => {
  return (
    <div className="h-screen grid place-items-center px-4">
      <div className="space-y-8">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="flex justify-center">
              <SiteLogo className="text-3xl" />
            </div>
            <div className="xl:w-[400px]">
              <AuthForm />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              By signing in, you agree to our{" "}
              <Link
                href="/terms"
                className="text-primary hover:underline underline-offset-2"
              >
                Terms of Service
              </Link>
              <br />
              and{" "}
              <Link
                href="/privacy"
                className="text-primary hover:underline underline-offset-2"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
