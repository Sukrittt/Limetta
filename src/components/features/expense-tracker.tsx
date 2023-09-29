import { Icons } from "@/components/icons";

export const ExpenseTracker = () => {
  const features = [
    {
      title: "Expense Tracking",
      descriptions: [
        "Track your expenses and see where your money is going.",
        "Set your ratios and see how much you are spending in each category.",
        "View transactions of the past 12 months",
      ],
    },
    {
      title: "Maintaining Accounts",
      descriptions: [
        "Maintain multiple accounts and track your transactions.",
        "See your account balance and transactions at a glance.",
        "Different accounts for different purposes.",
      ],
    },
    {
      title: "Transfer Money",
      descriptions: [
        "Transfer money between your accounts with ease.",
        "Total savings are calculated automatically and are transferred to your savings account at the start of the next month.",
      ],
    },
    {
      title: "Keep your due dates in check",
      descriptions: [
        "Set your due dates and come back to see what's due today.",
        "Never miss a due date again.",
      ],
    },
  ];
  return (
    <section className="flex flex-col gap-y-8 py-12">
      <div className="grid grid-cols-2">
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
            <div className="flex gap-x-4 relative">
              <div className="bg-primary rounded-md absolute h-12 w-12 grid place-items-center">
                <Icons.customize className="h-6 w-6" />
              </div>
              <div className="flex flex-col gap-y-2 pl-16">
                <p className="text-lg">Tailored to Your Needs</p>
                <p className="text-muted-foreground">
                  Set and update your income whenever needed. No rigid rules,
                  just tailored solutions for your dynamic financial life.
                </p>
              </div>
            </div>
            <div className="flex gap-x-4 relative">
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
      </div>
    </section>
  );
};
