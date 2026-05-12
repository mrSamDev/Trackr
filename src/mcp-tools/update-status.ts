import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { appGetHeardBackAt, appUpdateStatus } from "#/server/queries";
import { getNowIso, parseApplicationRow } from "./common";

export function registerUpdateApplicationStatus(server: McpServer) {
	server.tool(
		"updateApplicationStatus",
		"Update an application's status and auto-set heard_back_at",
		{
			id: z.number().int().positive(),
			status: z.enum(["applied", "interview", "rejected", "offer"]),
		},
		async (args) => {
			const now = getNowIso();

			const currentRow = appGetHeardBackAt(args.id);
			if (!currentRow) {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({ error: "Application not found" }),
						},
					],
				};
			}

			const parsed = z
				.object({ heard_back_at: z.string().nullable() })
				.parse(currentRow);

			let heard_back_at = parsed.heard_back_at;
			if (args.status !== "applied" && heard_back_at === null) {
				heard_back_at = now;
			}

			const row = appUpdateStatus(args.id, args.status, heard_back_at, now);
			return {
				content: [
					{ type: "text", text: JSON.stringify(parseApplicationRow(row)) },
				],
			};
		},
	);
}
