import { miscRouter } from "@/server/routers/misc";
import { userRouter } from "@/server/routers/user";
import { bookRouter } from "@/server/routers/book";
import { entryRouter } from "@/server/routers/entry";
import { createTRPCRouter, privateProcedure } from "@/server/trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  books: bookRouter,
  entries: entryRouter,
  misc: miscRouter,
  cron: privateProcedure.mutation(async ({ ctx }) => {
    const caller = miscRouter.createCaller(ctx);

    await caller.addMiscEntry({
      amount: 69,
      description: "cron job",
      entryType: "in",
      initialBalance: 1150,
    });
  }),
});

export type AppRouter = typeof appRouter;
