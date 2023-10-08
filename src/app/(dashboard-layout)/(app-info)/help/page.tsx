import { Divider } from "@nextui-org/divider";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { useFaqs } from "@/hooks/useFaqs";
import { ReportIssue } from "@/components/report-issue";
import { Card, CardContent } from "@/components/ui/card";

const Help = () => {
  const faqs = useFaqs();

  return (
    <div>
      <div className="grid items-center gap-8">
        <div className="grid gap-1">
          <div className="flex justify-between">
            <h1 className="line-clamp-1 text-3xl font-bold tracking-tight">
              Help
            </h1>
            <ReportIssue />
          </div>
          <p className="text-muted-foreground">
            Your go-to guide for common queries. Discover solutions and tips for
            a smoother financial journey.
          </p>
        </div>
        <ScrollShadow className="grid gap-4 h-[calc(85vh-90px)] w-full no-scrollbar">
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