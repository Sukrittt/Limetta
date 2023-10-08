import { cn } from "@/lib/utils";
import Link from "next/link";

interface SiteLogoProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export const SiteLogo = ({ className, ...props }: SiteLogoProps) => {
  return (
    <Link
      href="/"
      className={cn(
        "text-lg font-bold tracking-tight group hover:text-primary transition",
        className
      )}
      {...props}
    >
      <span className="text-primary group-hover:text-white transition">B</span>
      alance
      <span className="text-primary group-hover:text-white transition">W</span>
      ise
    </Link>
  );
};
