import { z } from "zod";

import { settingsGet, settingsUpsert } from "#/server/queries";
import { createTRPCRouter, publicProcedure } from "./init";
import { settingsRowSchema } from "./types";

export const settingsRouter = createTRPCRouter({
	getVisibleFields: publicProcedure.query(() => {
		const row = settingsGet("visible_fields");
		const parsed = settingsRowSchema.nullable().parse(row);
		if (!parsed) return [];
		try {
			return z.array(z.string()).parse(JSON.parse(parsed.value));
		} catch {
			return [];
		}
	}),

	setVisibleFields: publicProcedure
		.input(z.object({ fields: z.array(z.string()) }))
		.mutation(({ input }) => {
			settingsUpsert("visible_fields", JSON.stringify(input.fields));
			return { fields: input.fields };
		}),
});
