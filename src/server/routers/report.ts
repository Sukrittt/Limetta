import { z } from "zod";

import { db } from "@/db";
import { reports } from "@/db/schema";
import { createTRPCRouter, privateProcedure } from "@/server/trpc";

export const reportRouter = createTRPCRouter({
  createIssue: privateProcedure
    .input(
      z.object({
        description: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db.insert(reports).values({
        description: input.description,
        userId: ctx.userId,
      });
    }),
});
