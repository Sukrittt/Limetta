import { Metadata } from "next";
import { Divider } from "@nextui-org/divider";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { env } from "@/env.mjs";
import { useFaqs } from "@/hooks/useFaqs";
import { ReportIssue } from "@/components/report-issue";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "Help",
  description:
    "Get answers to your questions and find solutions on our Help page. Browse through frequently asked questions or report any issues you encounter for quick assistance.",
};

const Help = () => {
  const faqs = useFaqs();

  return (
    <div>
      <div className="grid items-center gap-8">
        <div className="grid gap-1">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Help</h1>
            <ReportIssue />
          </div>
          <p className="text-muted-foreground">
            Your go-to guide for common queries. Discover solutions and tips for
            a smoother financial journey.
          </p>
        </div>
        <ScrollShadow className="grid gap-4 h-[calc(85vh-90px)] w-full no-scrollbar pb-6">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardContent className="py-3">
                <h1 className="font-medium tracking-tight">{faq.question}</h1>
                <Divider className="mt-1" />
                <div className="mt-1 text-muted-foreground text-sm">
                  {faq.answer}
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollShadow>
      </div>
    </div>
  );
};

export default Help;
