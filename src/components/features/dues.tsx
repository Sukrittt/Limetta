import { Icons } from "@/components/icons";

export const Dues = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 py-12">
      <div></div>
      <div className="space-y-8">
        <div className="flex flex-col gap-y-4">
          <h3 className="text-3xl font-[900] tracking-tight">
            Keep your due dates in check
          </h3>
          <p className="text-muted-foreground">
            Stay organized and never miss a due date! Easily manage your dues,
            set payment dates, and mark them as &rsquo;Paid&rsquo; once
            completed.
          </p>
        </div>
        <div className="space-y-8">
          <div className="flex gap-x-4 relative">
            <div className="bg-primary rounded-md absolute h-12 w-12 grid place-items-center">
              <Icons.due className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-y-2 pl-16">
              <p className="text-lg">Effortless Due Management</p>
              <p className="text-muted-foreground">
                Schedule and monitor your upcoming dues effortlessly. Set due
                dates, track payments, and stay on top of your financial
                commitments.
              </p>
            </div>
          </div>
          <div className="flex gap-x-4 relative">
            <div className="bg-primary absolute rounded-md h-12 w-12 grid place-items-center">
              <Icons.dueCheck className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-y-2 pl-16">
              <p className="text-lg">Never Miss a Deadline</p>
              <p className="text-muted-foreground">
                Our due date tracking ensures you never miss a payment, whether
                it&rsquo;s your friend&rsquo;s &rsquo;borrowed&rsquo; cash or
                your monthly bills. Say goodbye to late fees and hello to
                financial peace of mind!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
