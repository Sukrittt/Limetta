import Balancer from "react-wrap-balancer";

import AuthForm from "@/components/forms/auth-form";

const SignIn = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 h-full">
      <div className="flex flex-col gap-y-8 sm:mt-8 py-24 px-8 sm:px-28">
        <div className="space-y-4">
          <h1 className="text-4xl font-medium max-w-lg xl:max-w-none">
            Begin Your Financial Journey with Balancewise
          </h1>
          <Balancer className="text-muted-foreground text-sm">
            Join our financial tracking platform to take control of your
            expenses, savings, and investments. Start your journey toward
            financial wellness today.
          </Balancer>
        </div>
        <div className="flex flex-col gap-y-4 max-w-md">
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
