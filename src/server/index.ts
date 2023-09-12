import { createTRPCRouter } from "@/server/trpc";
import { userRouter } from "@/server/routers/user";
import { bookRouter } from "@/server/routers/book";
import { entryRouter } from "@/server/routers/entry";

export const appRouter = createTRPCRouter({
  user: userRouter,
  books: bookRouter,
  entries: entryRouter,
});

export type AppRouter = typeof appRouter;
