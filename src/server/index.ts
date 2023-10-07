import { createTRPCRouter } from "@/server/trpc";
import { dueRouter } from "@/server/routers/dues";
import { userRouter } from "@/server/routers/user";
import { miscRouter } from "@/server/routers/misc";
import { bookRouter } from "@/server/routers/book";
import { entryRouter } from "@/server/routers/entry";
import { reportRouter } from "@/server/routers/report";
import { savingsRouter } from "@/server/routers/savings";
import { TransferRouter } from "@/server/routers/transfer";
import { investmentRouter } from "@/server/routers/investment";

export const appRouter = createTRPCRouter({
  dues: dueRouter,
  misc: miscRouter,
  user: userRouter,
  books: bookRouter,
  entries: entryRouter,
  savings: savingsRouter,
  transfer: TransferRouter,
  investments: investmentRouter,
  reports: reportRouter,
});

export type AppRouter = typeof appRouter;
