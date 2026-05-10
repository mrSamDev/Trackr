import { createFileRoute } from "@tanstack/react-router";
import { initDb } from "#/server/db";

export const Route = createFileRoute("/api/health")({
	server: {
		handlers: {
			GET: () => {
				try {
					const db = initDb();
					db.prepare("SELECT 1").get();
				} catch {
					return Response.json({ ok: false }, { status: 503 });
				}
				return Response.json({ ok: true });
			},
		},
	},
});
