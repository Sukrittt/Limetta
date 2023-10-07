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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 tracking-tight mt-2 w-full">
      {accountDetails.map((account, index) => (
        <Card
          key={index}
          className={cn("h-fit", {
            "mt-0 md:mt-0": index === 0,
            "mt-0 md:mt-[8rem]": index === 1,
            "mt-0 md:mt-[16rem]": index === 2,
          })}
        >
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
      ))}
    </div>
  );
};
