import { miscRouter } from "@/server/routers/misc";
import { userRouter } from "@/server/routers/user";
import { bookRouter } from "@/server/routers/book";
import { entryRouter } from "@/server/routers/entry";
import { createTRPCRouter } from "@/server/trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  books: bookRouter,
  entries: entryRouter,
  misc: miscRouter,
});

export type AppRouter = typeof appRouter;
