import { Icons } from "@/components/icons";

export const siteConfig = {
  name: "Balancewise",
  description: "Monthly expense tracker.",
};

export const sidebarItems = [
  {
    id: 1,
    label: "About",
    Icon: Icons.info,
    href: "/about",
  },
  {
    id: 2,
    label: "Overview",
    Icon: Icons.overview,
    href: "/overview",
  },
  {
    id: 3,
    label: "Customize",
    Icon: Icons.customize,
    href: "/customize",
  },
];
