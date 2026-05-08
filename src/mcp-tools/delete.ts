import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { appDelete } from "#/server/queries";

export function registerDeleteApplication(server: McpServer) {
	server.tool(
		"deleteApplication",
		"Hard delete an application by ID",
		{
			id: z.number().int().positive(),
		},
		async (args) => {
			appDelete(args.id);
			return {
				content: [{ type: "text", text: JSON.stringify({ deleted: true }) }],
			};
		},
	);
}
