import { cn } from "@/lib/utils";
import Link from "next/link";

interface SiteLogoProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export const SiteLogo = ({ className, ...props }: SiteLogoProps) => {
  return (
    <Link
      href="/"
      className={cn(
        "text-xl font-bold tracking-tight group hover:text-primary focus:text-primary transition focus:outline-none",
        className
      )}
      {...props}
    >
      Limetta
    </Link>
  );
};
