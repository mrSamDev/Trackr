import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { appList } from "#/server/queries";
import { parseApplicationRows } from "./common";

export function registerListApplications(server: McpServer) {
	server.tool(
		"listApplications",
		"List job applications with optional filters",
		{
			search: z.string().optional(),
			status: z.enum(["applied", "interview", "rejected", "offer"]).optional(),
			limit: z.number().int().min(1).max(100).optional(),
		},
		async (args) => {
			const rows = appList({
				status: args.status,
				search: args.search,
				limit: args.limit ?? 50,
			});

			return {
				content: [
					{ type: "text", text: JSON.stringify(parseApplicationRows(rows)) },
				],
			};
		},
	);
}
