import { Icons } from "@/components/icons";

export const TransferMoney = () => {
  return (
    <section className="flex flex-col gap-y-8 py-12">
      <div className="grid grid-cols-2">
        <div className="space-y-8">
          <div className="flex flex-col gap-y-4">
            <h3 className="text-3xl font-[900] tracking-tight">
              Transfer money between your accounts with ease
            </h3>
            <p className="text-muted-foreground">
              Move money between accounts effortlessly. Automatically shift your
              savings each month and invest with ease.
            </p>
          </div>
          <div className="space-y-8">
            <div className="flex gap-x-4 relative">
              <div className="bg-primary rounded-md absolute h-12 w-12 grid place-items-center">
                <Icons.transfer className="h-6 w-6" />
              </div>
              <div className="flex flex-col gap-y-2 pl-16">
                <p className="text-lg">Seamless Fund Reallocation</p>
                <p className="text-muted-foreground">
                  Easily shuffle your finances between your accounts. Whether
                  it&rsquo;s moving your savings for the month or reallocating
                  funds for investments, we make it simple.
                </p>
              </div>
            </div>
            <div className="flex gap-x-4 relative">
              <div className="bg-primary absolute rounded-md h-12 w-12 grid place-items-center">
                <Icons.piggy className="h-6 w-6" />
              </div>
              <div className="flex flex-col gap-y-2 pl-16">
                <p className="text-lg">Automatic Savings Management</p>
                <p className="text-muted-foreground">
                  Say goodbye to manual transfers. We automatically move your
                  savings from the previous month to your savings account at the
                  beginning of each month, ensuring your financial goals stay on
                  track.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
