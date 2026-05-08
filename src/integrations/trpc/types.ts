import { z } from "zod";

export const applicationInput = z.object({
	title: z.string().min(1),
	company: z.string().min(1),
	status: z.enum(["applied", "interview", "rejected", "offer"]),
	applied_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	location: z.string().optional().nullable(),
	salary: z.string().optional().nullable(),
	job_url: z.string().url().optional().or(z.literal("")).nullable(),
	source: z.string().optional().nullable(),
	notes: z.string().optional().nullable(),
});

export const applicationRowSchema = z.object({
	id: z.number(),
	title: z.string(),
	company: z.string(),
	status: z.enum(["applied", "interview", "rejected", "offer"]),
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

export const settingsRowSchema = z.object({
	value: z.string(),
});

export interface Application extends z.infer<typeof applicationRowSchema> {}

export type ApplicationInput = Omit<
	Application,
	"id" | "created_at" | "updated_at" | "heard_back_at"
>;

export type ApplicationUpdateInput = Partial<ApplicationInput>;

export function parseApplicationRow(row: unknown): Application {
	return applicationRowSchema.parse(row);
}

export function parseApplicationRows(rows: unknown[]): Application[] {
	return rows.map((r) => parseApplicationRow(r));
}

export function getNowIso(): string {
	return new Date().toISOString();
}

export interface WeekBucket {
	week: string;
	count: number;
}

export interface SourceBucket {
	source: string;
	count: number;
}

export interface CompanyBucket {
	company: string;
	count: number;
}

export interface AnalyticsData {
	total: number;
	statusCounts: {
		applied: number;
		interview: number;
		rejected: number;
		offer: number;
	};
	interviewRate: number;
	offerRate: number;
	avgResponseDays: number | null;
	active: number;
	weeklyActivity: WeekBucket[];
	topSources: SourceBucket[];
	topCompanies: CompanyBucket[];
}
