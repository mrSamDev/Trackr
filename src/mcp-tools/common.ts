import { z } from "zod";

export const applicationRowSchema = z.object({
	id: z.number(),
	title: z.string(),
	company: z.string(),
	status: z.string(),
	applied_at: z.string(),
	heard_back_at: z.string().nullable(),
	location: z.string().nullable(),
	salary: z.string().nullable(),
	job_url: z.string().nullable(),
	source: z.string().nullable(),
	notes: z.string().nullable(),
	created_at: z.string(),
	updated_at: z.string(),
});

export interface Application extends z.infer<typeof applicationRowSchema> {}

export const settingsRowSchema = z.object({
	value: z.string(),
});

export function getNowIso(): string {
	return new Date().toISOString();
}

export function parseApplicationRow(row: unknown): Application {
	return applicationRowSchema.parse(row);
}

export function parseApplicationRows(rows: unknown[]): Application[] {
	return rows.map((r) => parseApplicationRow(r));
}
