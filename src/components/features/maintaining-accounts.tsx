import { Icons } from "@/components/icons";
import { Accounts } from "@/components/examples/accounts";

export const MaintainingAccounts = () => {
  return (
    <section className="grid grid-cols-1 gap-y-12 xl:grid-cols-2 py-12">
      <div className="grid place-items-center sm:pr-8 order-2 xl:order-1">
        <Accounts />
      </div>
      <div className="space-y-8 order-1 xl:order-2">
        <div className="flex flex-col gap-y-4">
          <h3 className="text-3xl font-[900] tracking-tight">
            Maintain multiple accounts and track your transactions
          </h3>
          <p className="text-muted-foreground">
            Effortlessly manage multiple accounts and transactions with our
            user-friendly platform. Track expenses, investments, and savings
            seamlessly.
          </p>
        </div>
        <div className="space-y-8">
          <div className="flex gap-x-4 relative">
            <div className="bg-primary rounded-md absolute h-12 w-12 grid place-items-center">
              <Icons.wallet className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-y-2 pl-16">
              <p className="text-lg">Diverse Account Management</p>
              <p className="text-muted-foreground">
                Seamlessly manage various accounts, including miscellaneous,
                investment, and savings accounts, tailored to your financial
                goals. Stay organized by tracking transactions in each account,
                providing a clear overview of your financial landscape.
              </p>
            </div>
          </div>
          <div className="flex gap-x-4 relative">
            <div className="bg-primary absolute rounded-md h-12 w-12 grid place-items-center">
              <Icons.coins className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-y-2 pl-16">
              <p className="text-lg">Effortless Transaction Tracking</p>
              <p className="text-muted-foreground">
                Easily record and monitor transactions across your different
                accounts. Whether you&rsquo;re logging expenses, investments, or
                savings, our user-friendly interface ensures you stay in control
                of your finances with simplicity and precision.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
