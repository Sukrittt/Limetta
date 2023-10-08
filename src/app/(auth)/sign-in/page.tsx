import Link from "next/link";

import { SiteLogo } from "@/components/site-logo";
import AuthForm from "@/components/forms/auth-form";
import { Card, CardContent } from "@/components/ui/card";

const SignIn = () => {
  return (
    <div className="h-[100dvh] grid place-items-center px-4">
      <div className="space-y-8">
        <div className="flex justify-center">
          <SiteLogo className="text-3xl" />
        </div>

        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="xl:w-[400px]">
              <AuthForm />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-primary">
                Terms of Service
              </Link>
              <br />
              and{" "}
              <Link href="/privacy" className="text-primary">
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
