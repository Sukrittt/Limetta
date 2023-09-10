import { TRPCError, initTRPC } from "@trpc/server";

import { getAuthSession } from "@/lib/auth";

export const createTRPCContext = () => {
  return {};
};

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

const enforcedUserIsAuthed = t.middleware(async ({ next }) => {
  const session = await getAuthSession();

  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }

  return next({
    ctx: {
      userId: session.user.id,
    },
  });
});

export const privateProcedure = t.procedure.use(enforcedUserIsAuthed);
