import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-5">
      <Link href="/sign-in" className={buttonVariants()}>
        BalanceWise
      </Link>
    </div>
  );
}
