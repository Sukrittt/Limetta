import Link from "next/link";
import { Shell } from "@/components/shell";
import { Button } from "@nextui-org/button";
import { buttonVariants } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <Shell>
      <Button
        className={buttonVariants({ variant: "secondary" })}
        as={Link}
        href="/expense-tracker"
      >
        Expense Tracker
      </Button>
    </Shell>
  );
};

export default Dashboard;
