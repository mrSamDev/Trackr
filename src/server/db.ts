import { mkdirSync } from "node:fs";
import Database from "better-sqlite3";

type DatabaseInstance = InstanceType<typeof Database>;

let database: DatabaseInstance | null = null;

function bootstrapSchema(db: DatabaseInstance): void {
	db.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('applied','interview','rejected','offer')),
      applied_at TEXT NOT NULL,
      heard_back_at TEXT,
      location TEXT,
      salary TEXT,
      job_url TEXT,
      source TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
    CREATE INDEX IF NOT EXISTS idx_applications_company ON applications(company);

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user (
      id TEXT NOT NULL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      emailVerified INTEGER NOT NULL DEFAULT 0,
      image TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS session (
      id TEXT NOT NULL PRIMARY KEY,
      expiresAt TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      ipAddress TEXT,
      userAgent TEXT,
      userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS account (
      id TEXT NOT NULL PRIMARY KEY,
      accountId TEXT NOT NULL,
      providerId TEXT NOT NULL,
      userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
      accessToken TEXT,
      refreshToken TEXT,
      idToken TEXT,
      accessTokenExpiresAt TEXT,
      refreshTokenExpiresAt TEXT,
      scope TEXT,
      password TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS verification (
      id TEXT NOT NULL PRIMARY KEY,
      identifier TEXT NOT NULL,
      value TEXT NOT NULL,
      expiresAt TEXT NOT NULL,
      createdAt TEXT,
      updatedAt TEXT
    );
  `);
}

export function initDb(): DatabaseInstance {
	if (!database) {
		mkdirSync("data", { recursive: true });
		database = new Database("data/tracker.db");
		bootstrapSchema(database);
	}
	return database;
}

// Lazy singleton for backward compat with consumers that expect `export const db`
// Initialization is deferred until first actual use.
export const db = new Proxy({} as DatabaseInstance, {
	get(_, prop) {
		const instance = initDb();
		const value = instance[prop as keyof DatabaseInstance];
		if (typeof value === "function") {
			return value.bind(instance);
		}
		return value;
	},
});
