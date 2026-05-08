import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { appGetById } from "#/server/queries";
import { parseApplicationRow } from "./common";

export function registerGetApplication(server: McpServer) {
	server.tool(
		"getApplication",
		"Get a single application by ID",
		{
			id: z.number().int().positive(),
		},
		async (args) => {
			const row = appGetById(args.id);
			return {
				content: [{ type: "text", text: JSON.stringify(row ? parseApplicationRow(row) : null) }],
			};
		},
	);
}
