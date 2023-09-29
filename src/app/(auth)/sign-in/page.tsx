import Image from "next/image";
import Balancer from "react-wrap-balancer";

import AuthForm from "@/components/forms/auth-form";

const SignIn = () => {
  return (
    <div className="grid grid-cols-2 h-full">
      <div className="flex flex-col gap-y-8 mt-8 py-24 px-28">
        <div className="space-y-4">
          <h1 className="text-4xl font-medium">
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
      <div className="p-5 h-full flex items-center justify-center">
        <div className="relative h-[350px] w-[600px] border rounded-2xl shadow-2xl overflow-hidden">
          <Image
            src="/images/dashboard-snapshot.png"
            alt="dashbaord-snapshot"
            className="object-contain"
            fill
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;

// <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
//   <div className="flex flex-col space-y-2 text-center">
//     <h1 className="text-2xl font-semibold tracking-tight">
//       {`Welcome to ${siteConfig.name}`}
//     </h1>
//     <p className="text-sm text-muted-foreground">
//       Choose your preferred sign in method
//     </p>
//   </div>
//   <AuthForm />
// </div>
