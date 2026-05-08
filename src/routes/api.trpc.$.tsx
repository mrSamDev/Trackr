import { createFileRoute } from "@tanstack/react-router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { createContext } from "#/integrations/trpc/init";
import { appRouter } from "#/integrations/trpc/router";

function handler({ request }: { request: Request }) {
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		router: appRouter,
		req: request,
		createContext,
	});
}

export const Route = createFileRoute("/api/trpc/$")({
	server: {
		handlers: {
			GET: handler,
			POST: handler,
		},
	},
});
