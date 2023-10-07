import { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[90vh] lg:min-h-screen">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
