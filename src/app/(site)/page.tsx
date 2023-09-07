import Link from "next/link";
import { Button } from "@nextui-org/button";

import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="p-5">
      <Button className={buttonVariants()} as={Link} href="/sign-in">
        BalanceWise
      </Button>
    </div>
  );
}
