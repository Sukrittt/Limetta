import { privateProcedure, publicProcedure, router } from "./trpc";

export const appRouter = router({
  getMessages: publicProcedure.query(async () => {
    return [1, 2, 3, 4];
  }),
  getSensitiveData: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return {
      data: "sensitive data",
      userId,
    };
  }),
});

export type AppRouter = typeof appRouter;
