import Link from "next/link";
import { Metadata } from "next";
import { Divider } from "@nextui-org/divider";

import { env } from "@/env.mjs";
import { contact, siteConfig } from "@/config";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "Contact",
  description:
    "Connect with the author and provide feedback or ask questions through our Contact page. Find the contact details you need to reach out for support or inquiries.",
};

const Contact = () => {
  return (
    <Card>
      <CardContent className="grid items-center gap-8 pb-8 pt-6 md:py-6">
        <div>
          <div className="grid gap-1">
            <h1 className="line-clamp-1 text-3xl font-bold tracking-tight py-1">
              Contact
            </h1>
            <p className="text-muted-foreground">
              If you have any questions or concerns about {siteConfig.name},
              please contact us using one of the methods below. We will try to
              respond as soon as possible.
            </p>
          </div>
        </div>

        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Contact Information (WIP)
          </h1>
          <Divider className="my-2" />
          <ul className="space-y-2 mt-4">
            {contact.map((contactInfo) => (
              <li key={contactInfo.id}>
                <span className="font-semibold">{contactInfo.label}</span>:{" "}
                <Link
                  href={contactInfo.href}
                  target="_blank"
                  className="underline font-medium tracking-tight underline-offset-4"
                >
                  {contactInfo.linkLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Contact;
