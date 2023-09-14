import { Shell } from "@/components/shell";
import { IncomeSkeleton } from "@/components/income-skeleton";

const loading = () => {
  return (
    <Shell className="px-0">
      <IncomeSkeleton title="Tailor Your Monthly Budget and Expense Ratio" />
    </Shell>
  );
};

export default loading;
