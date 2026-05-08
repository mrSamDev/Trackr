import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const jsonRpcMessageSchema = z.object({
	jsonrpc: z.literal("2.0"),
	id: z.union([z.string(), z.number(), z.null()]).optional(),
	method: z.string().optional(),
	params: z.record(z.string(), z.unknown()).optional(),
	result: z.unknown().optional(),
	error: z.object({ code: z.number(), message: z.string() }).optional(),
});

export async function handleMcpRequest(
	request: Request,
	server: McpServer,
): Promise<Response> {
	try {
		const rawBody = await request.json();
		const validatedBody = jsonRpcMessageSchema.parse(rawBody);
		const jsonRpcRequest = validatedBody as JSONRPCMessage;

		const [clientTransport, serverTransport] =
			InMemoryTransport.createLinkedPair();

		let responseData: JSONRPCMessage | null = null;

		clientTransport.onmessage = (message: JSONRPCMessage) => {
			responseData = message;
		};

		await server.connect(serverTransport);

		await clientTransport.start();
		await serverTransport.start();

		await clientTransport.send(jsonRpcRequest);

		await new Promise((resolve) => setTimeout(resolve, 10));

		await clientTransport.close();
		await serverTransport.close();

		return Response.json(responseData, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("MCP handler error:", error);

		return Response.json(
			{
				jsonrpc: "2.0",
				error: {
					code: -32603,
					message: "Internal server error",
					data: error instanceof Error ? error.message : String(error),
				},
				id: null,
			},
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}
}
