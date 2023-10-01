import { IncomeCardSkeleton } from "@/components/skeletons/income-card-skeleton";

const loading = () => {
  return (
    <div className="min-h-[calc(100vh-150px)] max-w-xl p-5 m-auto flex items-center justify-center">
      <IncomeCardSkeleton
        title="Financial Setup: Let&rsquo;s Get Started"
        onBoarding
      />
    </div>
  );
};

export default loading;
