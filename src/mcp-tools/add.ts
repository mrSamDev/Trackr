import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { appCreate } from "#/server/queries";
import { getNowIso, parseApplicationRow } from "./common";

export function registerAddApplication(server: McpServer) {
	server.tool(
		"addApplication",
		"Add a new job application",
		{
			title: z.string().min(1),
			company: z.string().min(1),
			status: z.enum(["applied", "interview", "rejected", "offer"]).optional(),
			applied_at: z.string().optional(),
			location: z.string().optional(),
			salary: z.string().optional(),
			job_url: z.string().optional(),
			source: z.string().optional(),
			notes: z.string().optional(),
		},
		async (args) => {
			const now = getNowIso();
			const status = args.status ?? "applied";

			const row = appCreate({
				title: args.title,
				company: args.company,
				status,
				applied_at: args.applied_at ?? now.split("T")[0],
				heard_back_at: status !== "applied" ? now : null,
				location: args.location ?? null,
				salary: args.salary ?? null,
				job_url: args.job_url ?? null,
				source: args.source ?? null,
				notes: args.notes ?? null,
				now,
			});

			return {
				content: [
					{ type: "text", text: JSON.stringify(parseApplicationRow(row)) },
				],
			};
		},
	);
}
