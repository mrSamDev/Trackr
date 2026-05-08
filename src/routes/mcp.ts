import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createFileRoute } from "@tanstack/react-router";

import { registerApplicationTools } from "#/mcp-applications";
import { handleMcpRequest } from "#/utils/mcp-handler";

let server: McpServer | null = null;

function getMcpServer(): McpServer {
	if (!server) {
		server = new McpServer({
			name: "job-tracker",
			version: "1.0.0",
		});
		registerApplicationTools(server);
	}
	return server;
}

export const Route = createFileRoute("/mcp")({
	server: {
		handlers: {
			POST: async ({ request }) => handleMcpRequest(request, getMcpServer()),
		},
	},
});
