import { Navbar } from "@/components/layout/navbar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[90vh] lg:min-h-screen">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
