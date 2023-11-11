import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Accounts = () => {
  const accountDetails = [
    {
      title: "Savings Account",
      balance: 1_000,
      icon: Icons.piggy,
    },
    {
      title: "Investments Account",
      balance: 5_000,
      icon: Icons.investments,
    },
    {
      title: "Miscellaneous Account",
      balance: 25_00,
      icon: Icons.siren,
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {accountDetails.map((account, index) => (
        <div
          className={cn("flex", {
            "justify-center sm:justify-start": index === 0,
            "justify-center": index === 1,
            "justify-center sm:justify-end": index === 2,
          })}
          key={index}
        >
          <Card className="w-[300px] bg-[#1c1917] border-[#27272a] text-white">
            <CardTitle>
              <CardHeader className="py-4 font-normal">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="cursor-pointer hover:text-primary transition text-sm">
                    {account.title}
                  </span>
                  <span className="cursor-pointer hover:text-primary transition">
                    <account.icon className="h-4 w-4" />
                  </span>
                </div>
              </CardHeader>
            </CardTitle>
            <CardContent className="flex flex-col gap-y-2">
              <span className="text-4xl font-bold tracking-wide">
                <span>₹</span>
                {Math.abs(account.balance).toLocaleString()}
              </span>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};
