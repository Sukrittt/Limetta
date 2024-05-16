import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { db } from "@/db";
import { userRouter } from "@/server/routers/user";
import { createTRPCRouter, privateProcedure } from "@/server/trpc";
import { investments, miscellaneous, savings, users } from "@/db/schema";

export const TransferRouter = createTRPCRouter({
  transferAmount: privateProcedure
    .input(
      z.object({
        amount: z.number().positive(),
        from: z.enum(["investments", "savings", "miscellaneous"]),
        to: z.enum(["investments", "savings", "miscellaneous"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const caller = userRouter.createCaller(ctx);
      const currentUser = await caller.getCurrentUser();

      //from operations
      if (input.from === "investments") {
        if (input.from === input.to) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot transfer to the same account",
          });
        }

        if (input.amount > parseFloat(currentUser.investmentsBalance)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Insufficient funds",
          });
        }

        const promises = [
          db.insert(investments).values({
            amount: input.amount.toString(),
            entryType: "out",
            transferingTo: input.to,
            userId: ctx.userId,
            entryName: `Transfer to ${input.to}`,
          }),
          db
            .update(users)
            .set({
              investmentsBalance: (
                parseFloat(currentUser.investmentsBalance) - input.amount
              ).toString(),
            })
            .where(eq(users.id, ctx.userId)),
        ];

        await Promise.all(promises);
      } else if (input.from === "savings") {
        if (input.from === input.to) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot transfer to the same account",
          });
        }

        if (input.amount > parseFloat(currentUser.savingsBalance)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Insufficient funds",
          });
        }

        const promises = [
          db.insert(savings).values({
            amount: input.amount.toString(),
            entryType: "out",
            transferingTo: input.to,
            userId: ctx.userId,
            entryName: `Transfer to ${input.to}`,
          }),
          db
            .update(users)
            .set({
              savingsBalance: (
                parseFloat(currentUser.savingsBalance) - input.amount
              ).toString(),
            })
            .where(eq(users.id, ctx.userId)),
        ];

        await Promise.all(promises);
      } else if (input.from === "miscellaneous") {
        if (input.from === input.to) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot transfer to the same account",
          });
        }

        if (input.amount > parseFloat(currentUser.miscellanousBalance)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Insufficient funds",
          });
        }

        const promises = [
          db.insert(miscellaneous).values({
            amount: input.amount.toString(),
            entryType: "out",
            transferingTo: input.to,
            userId: ctx.userId,
            entryName: `Transfer to ${input.to}`,
          }),
          db
            .update(users)
            .set({
              miscellanousBalance: (
                parseFloat(currentUser.miscellanousBalance) - input.amount
              ).toString(),
            })
            .where(eq(users.id, ctx.userId)),
        ];

        await Promise.all(promises);
      }

      //to operations
      if (input.to === "investments") {
        if (input.from === input.to) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot transfer to the same account",
          });
        }

        const promises = [
          db.insert(investments).values({
            amount: input.amount.toString(),
            entryType: "in",
            transferingFrom: input.from,
            userId: ctx.userId,
            entryName: `Transfer from ${input.to}`,
          }),
          db
            .update(users)
            .set({
              investmentsBalance: (
                parseFloat(currentUser.investmentsBalance) + input.amount
              ).toString(),
            })
            .where(eq(users.id, ctx.userId)),
        ];

        await Promise.all(promises);
      } else if (input.to === "savings") {
        if (input.from === input.to) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot transfer to the same account",
          });
        }

        const promises = [
          db.insert(savings).values({
            amount: input.amount.toString(),
            entryType: "in",
            transferingFrom: input.from,
            userId: ctx.userId,
            entryName: `Transfer from ${input.to}`,
          }),
          db
            .update(users)
            .set({
              savingsBalance: (
                parseFloat(currentUser.savingsBalance) + input.amount
              ).toString(),
            })
            .where(eq(users.id, ctx.userId)),
        ];

        await Promise.all(promises);
      } else if (input.to === "miscellaneous") {
        if (input.from === input.to) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot transfer to the same account",
          });
        }

        const promises = [
          db.insert(miscellaneous).values({
            amount: input.amount.toString(),
            entryType: "in",
            transferingFrom: input.from,
            userId: ctx.userId,
            entryName: `Transfer from ${input.to}`,
          }),
          db
            .update(users)
            .set({
              miscellanousBalance: (
                parseFloat(currentUser.miscellanousBalance) + input.amount
              ).toString(),
            })
            .where(eq(users.id, ctx.userId)),
        ];

        await Promise.all(promises);
      }
    }),
});
