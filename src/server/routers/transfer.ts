import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { db } from "@/db";
import { createTRPCRouter, privateProcedure } from "@/server/trpc";
import { investments, miscellaneous, savings, users } from "@/db/schema";

export const TransferRouter = createTRPCRouter({
  transferAmount: privateProcedure
    .input(
      z.object({
        amount: z.number().positive(),
        investmentsBalance: z.number(),
        savingsBalance: z.number(),
        miscellaneousBalance: z.number(),
        from: z.enum(["investments", "savings", "miscellaneous"]),
        to: z.enum(["investments", "savings", "miscellaneous"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      //from operations
      if (input.from === "investments") {
        if (input.from === input.to) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot transfer to the same account",
          });
        }

        if (input.amount > input.investmentsBalance) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Insufficient funds",
          });
        }

        const promises = [
          db.insert(investments).values({
            amount: input.amount,
            entryType: "out",
            transferingTo: input.to,
            userId: ctx.userId,
            entryName: `Transfer to ${input.to}`,
          }),
          db
            .update(users)
            .set({
              investmentsBalance: input.investmentsBalance - input.amount,
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

        if (input.amount > input.savingsBalance) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Insufficient funds",
          });
        }

        const promises = [
          db.insert(savings).values({
            amount: input.amount,
            entryType: "out",
            transferingTo: input.to,
            userId: ctx.userId,
            entryName: `Transfer to ${input.to}`,
          }),
          db
            .update(users)
            .set({
              savingsBalance: input.savingsBalance - input.amount,
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

        if (input.amount > input.miscellaneousBalance) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Insufficient funds",
          });
        }

        const promises = [
          db.insert(miscellaneous).values({
            amount: input.amount,
            entryType: "out",
            transferingTo: input.to,
            userId: ctx.userId,
            entryName: `Transfer to ${input.to}`,
          }),
          db
            .update(users)
            .set({
              miscellanousBalance: input.investmentsBalance - input.amount,
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
            amount: input.amount,
            entryType: "in",
            transferingFrom: input.from,
            userId: ctx.userId,
            entryName: `Transfer from ${input.to}`,
          }),
          db
            .update(users)
            .set({
              investmentsBalance: input.investmentsBalance + input.amount,
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
            amount: input.amount,
            entryType: "in",
            transferingFrom: input.from,
            userId: ctx.userId,
            entryName: `Transfer from ${input.to}`,
          }),
          db
            .update(users)
            .set({
              savingsBalance: input.savingsBalance + input.amount,
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
            amount: input.amount,
            entryType: "in",
            transferingFrom: input.from,
            userId: ctx.userId,
            entryName: `Transfer from ${input.to}`,
          }),
          db
            .update(users)
            .set({
              miscellanousBalance: input.miscellaneousBalance + input.amount,
            })
            .where(eq(users.id, ctx.userId)),
        ];

        await Promise.all(promises);
      }
    }),
});
