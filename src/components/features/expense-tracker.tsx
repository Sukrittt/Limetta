import { Icons } from "@/components/icons";
import { Onboarding } from "@/components/examples/onboading";

export const ExpenseTracker = () => {
  return (
    <section className="grid grid-cols-1 gap-y-12 xl:grid-cols-2 py-12">
      <div className="space-y-8">
        <div className="flex flex-col gap-y-4">
          <h3 className="text-3xl font-[900] tracking-tight">
            Track your expenses and see where your money is going
          </h3>
          <p className="text-muted-foreground">
            We seamlessly allocate your monthly income based on your
            preferences, providing a clear overview of your spending every
            month. Experience the difference right from the start.
          </p>
        </div>
        <div className="space-y-8">
          <div className="flex flex-row gap-x-4 relative">
            <div className="bg-primary rounded-md absolute h-12 w-12 grid place-items-center">
              <Icons.customize className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-y-2 pl-16">
              <p className="text-lg">Tailored to Your Needs</p>
              <p className="text-muted-foreground">
                Set and update your income whenever needed. No rigid rules, just
                tailored solutions for your dynamic financial life.
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-x-4 relative">
            <div className="bg-primary absolute rounded-md h-12 w-12 grid place-items-center">
              <Icons.overview className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-y-2 pl-16">
              <p className="text-lg">Transparent Financial Insights</p>
              <p className="text-muted-foreground">
                Download your monthly expenses with pre-calculated data. Dive
                into the past year&rsquo;s expenses or focus on a specific
                month. Visualize it all with clean, informative graphs.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid place-items-center sm:px-8">
        <Onboarding />
      </div>
    </section>
  );
};
