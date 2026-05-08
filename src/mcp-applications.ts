import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerAddApplication } from "./mcp-tools/add";
import { registerDeleteApplication } from "./mcp-tools/delete";
import { registerGetApplication } from "./mcp-tools/get";
import { registerListApplications } from "./mcp-tools/list";
import {
	registerGetSettings,
	registerUpdateSettings,
} from "./mcp-tools/settings";
import { registerUpdateApplicationStatus } from "./mcp-tools/update-status";

export function registerApplicationTools(server: McpServer) {
	registerListApplications(server);
	registerAddApplication(server);
	registerGetApplication(server);
	registerUpdateApplicationStatus(server);
	registerDeleteApplication(server);
	registerGetSettings(server);
	registerUpdateSettings(server);
}
