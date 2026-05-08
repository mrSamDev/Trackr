import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { settingsGet, settingsUpsert } from "#/server/queries";
import { settingsRowSchema } from "./common";

export function registerGetSettings(server: McpServer) {
	server.tool("getSettings", "Get visible fields settings", async () => {
		const row = settingsGet("visible_fields");
		const parsed = settingsRowSchema.nullable().parse(row);
		const visible_fields = parsed
			? z.array(z.string()).parse(JSON.parse(parsed.value))
			: [];

		return {
			content: [{ type: "text", text: JSON.stringify({ visible_fields }) }],
		};
	});
}

export function registerUpdateSettings(server: McpServer) {
	server.tool(
		"updateSettings",
		"Update visible fields settings",
		{
			visible_fields: z.array(z.string()),
		},
		async (args) => {
			settingsUpsert("visible_fields", JSON.stringify(args.visible_fields));

			return {
				content: [{ type: "text", text: JSON.stringify({ visible_fields: args.visible_fields }) }],
			};
		},
	);
}
