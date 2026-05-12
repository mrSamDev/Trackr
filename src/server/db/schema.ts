import type { InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// ─── Applications ────────────────────────────────────────────────────────────

export const applications = sqliteTable("applications", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	title: text("title").notNull(),
	company: text("company").notNull(),
	status: text("status", {
		enum: ["applied", "interview", "rejected", "offer"],
	}).notNull(),
	appliedAt: text("applied_at").notNull(),
	heardBackAt: text("heard_back_at"),
	location: text("location"),
	salary: text("salary"),
	jobUrl: text("job_url"),
	source: text("source"),
	notes: text("notes"),
	createdAt: text("created_at").notNull(),
	updatedAt: text("updated_at").notNull(),
});

export type Application = InferSelectModel<typeof applications>;

// ─── Settings ────────────────────────────────────────────────────────────────

export const settings = sqliteTable("settings", {
	key: text("key").primaryKey(),
	value: text("value").notNull(),
});

export type Setting = InferSelectModel<typeof settings>;

// ─── Better Auth Tables ─────────────────────────────────────────────────────

export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("emailVerified", { mode: "boolean" })
		.notNull()
		.default(false),
	image: text("image"),
	createdAt: text("createdAt").notNull(),
	updatedAt: text("updatedAt").notNull(),
});

export type User = InferSelectModel<typeof user>;

export const session = sqliteTable("session", {
	id: text("id").primaryKey(),
	expiresAt: text("expiresAt").notNull(),
	token: text("token").notNull().unique(),
	createdAt: text("createdAt").notNull(),
	updatedAt: text("updatedAt").notNull(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export type Session = InferSelectModel<typeof session>;

export const account = sqliteTable("account", {
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: text("accessTokenExpiresAt"),
	refreshTokenExpiresAt: text("refreshTokenExpiresAt"),
	scope: text("scope"),
	password: text("password"),
	createdAt: text("createdAt").notNull(),
	updatedAt: text("updatedAt").notNull(),
});

export type Account = InferSelectModel<typeof account>;

export const verification = sqliteTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: text("expiresAt").notNull(),
	createdAt: text("createdAt"),
	updatedAt: text("updatedAt"),
});

export type Verification = InferSelectModel<typeof verification>;
