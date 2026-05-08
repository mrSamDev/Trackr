import { initTRPC, TRPCError } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import superjson from "superjson";
import { auth } from "#/lib/auth";

export async function createContext({ req }: FetchCreateContextFnOptions) {
	const session = await auth.api.getSession({ headers: req.headers });
	return { session };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });
	return next({ ctx: { ...ctx, session: ctx.session, user: ctx.session.user } });
});
