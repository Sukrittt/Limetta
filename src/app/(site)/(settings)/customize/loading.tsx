import { Shell } from "@/components/shell";
import { IncomeCardSkeleton } from "@/components/income-card-skeleton";

const loading = () => {
  return (
    <Shell className="px-0">
      <IncomeCardSkeleton title="Tailor Your Monthly Budget and Expense Ratio" />
    </Shell>
  );
};

export default loading;
