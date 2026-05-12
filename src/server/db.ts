import { mkdirSync } from "node:fs";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./db/schema";

let database: Database | null = null;

export function initDb(): Database {
	if (!database) {
		mkdirSync("data", { recursive: true });
		database = new Database("data/tracker.db");
	}
	return database;
}

export const db = drizzle(initDb(), { schema });
