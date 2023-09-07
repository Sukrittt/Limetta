import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  getMessages: publicProcedure.query(async (opts) => {
    return [1, 2, 3, 4];
  }),
});

export type AppRouter = typeof appRouter;
