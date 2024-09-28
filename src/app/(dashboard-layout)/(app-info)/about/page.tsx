import Link from "next/link";
import { Metadata } from "next";
import { Divider } from "@nextui-org/divider";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { env } from "@/env.mjs";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { features, techStack, team, credits } from "@/config";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "About",
  description:
    "Discover more about the application on our About page. Learn about our tech stack, explore key features, and connect with the author on social media for updates and insights.",
};

const About = () => {
  const linkStyle = "underline font-medium tracking-tight underline-offset-4";

  return (
    <Card>
      <ScrollShadow className="h-[calc(100vh-120px)] xl:h-[calc(100vh-90px)] w-full no-scrollbar">
        <CardContent className="grid items-center gap-8 pb-8 pt-6 md:py-6">
          <div>
            <div className="grid gap-1">
              <h1 className="line-clamp-1 text-3xl font-bold tracking-tight py-1">
                About
              </h1>
              <p className="text-muted-foreground">
                About the project and its team members.
              </p>
            </div>
            <Divider className="my-4" />
            <p className="font-light">
              Elevate your financial management with Balancewise. Our
              user-friendly{" "}
              <Link
                href="https://nextjs.org/"
                target="_blank"
                className={linkStyle}
              >
                Next.js.
              </Link>{" "}
              app simplifies expense tracking, offers multiple account
              management, easy money transfers, and efficient dues tracking.
              Take charge of your finances and make informed choices, all in one
              platform.
            </p>
          </div>

          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Tech stack used
            </h1>
            <Divider className="mt-2 mb-4" />
            <ul className="space-y-2 mx-5 mt-2">
              {techStack.map((tech, index) => (
                <li key={index} className="list-disc">
                  <Link href={tech.url} target="_blank" className={linkStyle}>
                    {tech.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Key features
            </h1>
            <Divider className="mt-2 mb-4" />
            <ul className="space-y-2 mx-5 mt-2">
              {features.map((feature, index) => (
                <li key={index} className="list-disc">
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h1 className="text-xl font-semibold tracking-tight">Credits</h1>
            <Divider className="mt-2 mb-4" />
            <ul className="space-y-2 mx-5 mt-2">
              {credits.map((person, index) => (
                <li key={index} className="list-disc">
                  <Link
                    className={linkStyle}
                    target="_blank"
                    href={person.social}
                  >
                    {person.name}
                  </Link>{" "}
                  - {person.role}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h1 className="text-xl font-semibold tracking-tight">Team</h1>
            <Divider className="mt-2 mb-4" />
            <ul className="space-y-2 mx-5 mt-2">
              {team.map((members, index) => (
                <li key={index} className="list-disc">
                  <Link
                    className={linkStyle}
                    target="_blank"
                    href={members.social}
                  >
                    {members.name}
                  </Link>{" "}
                  - {members.role}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full flex justify-end items-center">
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "w-fit"
              )}
            >
              Contact <Icons.right className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </ScrollShadow>
    </Card>
  );
};

export default About;
