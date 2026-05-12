import { asc, count, desc, eq, like, or, sql } from "drizzle-orm";
import { db } from "#/server/db";
import { applications, settings } from "#/server/db/schema";

// ─── Applications ────────────────────────────────────────────────────────────

export function appGetById(id: number) {
	return db.select().from(applications).where(eq(applications.id, id)).get();
}

export function appGetHeardBackAt(id: number) {
	return db
		.select({ heardBackAt: applications.heardBackAt })
		.from(applications)
		.where(eq(applications.id, id))
		.get();
}

export function appList(
	opts: { status?: string; search?: string; limit?: number } = {},
) {
	let query = db
		.select()
		.from(applications)
		.orderBy(desc(applications.createdAt));

	if (opts.status) {
		query = query.where(eq(applications.status, opts.status));
	}

	if (opts.search?.trim()) {
		const search = opts.search.trim();
		query = query.where(
			or(
				like(applications.title, `%${search}%`),
				like(applications.company, `%${search}%`),
			),
		);
	}

	if (opts.limit !== undefined) {
		query = query.limit(opts.limit);
	}

	return query.all();
}

export function appCreate(params: {
	title: string;
	company: string;
	status: string;
	applied_at: string;
	heard_back_at: string | null;
	location: string | null;
	salary: string | null;
	job_url: string | null;
	source: string | null;
	notes: string | null;
	now: string;
}) {
	return db
		.insert(applications)
		.values({
			title: params.title,
			company: params.company,
			status: params.status,
			appliedAt: params.applied_at,
			heardBackAt: params.heard_back_at,
			location: params.location,
			salary: params.salary,
			jobUrl: params.job_url,
			source: params.source,
			notes: params.notes,
			createdAt: params.now,
			updatedAt: params.now,
		})
		.returning()
		.get();
}

export function appUpdate(id: number, setEntries: Array<[string, unknown]>) {
	const values = Object.fromEntries(setEntries);
	return db
		.update(applications)
		.set({ ...values, updatedAt: values.updatedAt as string })
		.where(eq(applications.id, id))
		.returning()
		.get();
}

export function appUpdateStatus(
	id: number,
	status: string,
	heard_back_at: string | null,
	now: string,
) {
	return db
		.update(applications)
		.set({
			status,
			heardBackAt: heard_back_at,
			updatedAt: now,
		})
		.where(eq(applications.id, id))
		.returning()
		.get();
}

export function appDelete(id: number) {
	return db.delete(applications).where(eq(applications.id, id)).run();
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export function analyticsStatusCounts() {
	return db
		.select({
			total: count(),
			applied: sql<number>`SUM(CASE WHEN status='applied' THEN 1 ELSE 0 END)`,
			interview: sql<number>`SUM(CASE WHEN status='interview' THEN 1 ELSE 0 END)`,
			rejected: sql<number>`SUM(CASE WHEN status='rejected' THEN 1 ELSE 0 END)`,
			offer: sql<number>`SUM(CASE WHEN status='offer' THEN 1 ELSE 0 END)`,
		})
		.from(applications)
		.get();
}

export function analyticsAvgResponseDays() {
	return db
		.select({
			avgDays: sql<number>`AVG(CAST(julianday(${applications.heardBackAt}) - julianday(${applications.appliedAt}) AS REAL))`,
		})
		.from(applications)
		.where(
			sql`${applications.heardBackAt} IS NOT NULL AND ${applications.appliedAt} IS NOT NULL`,
		)
		.get();
}

export function analyticsWeeklyActivity() {
	return db
		.select({
			week: sql<string>`strftime('%Y-%W', ${applications.appliedAt})`,
			count: count(),
		})
		.from(applications)
		.where(sql`${applications.appliedAt} >= date('now', '-84 days')`)
		.groupBy(sql`strftime('%Y-%W', ${applications.appliedAt})`)
		.orderBy(asc(sql`strftime('%Y-%W', ${applications.appliedAt})`))
		.all();
}

export function analyticsTopSources() {
	return db
		.select({
			source: applications.source,
			count: count(),
		})
		.from(applications)
		.where(
			sql`${applications.source} IS NOT NULL AND ${applications.source} != ''`,
		)
		.groupBy(applications.source)
		.orderBy(desc(count()))
		.limit(5)
		.all();
}

export function analyticsTopCompanies() {
	return db
		.select({
			company: applications.company,
			count: count(),
		})
		.from(applications)
		.groupBy(applications.company)
		.orderBy(desc(count()))
		.limit(5)
		.all();
}

// ─── Settings ────────────────────────────────────────────────────────────────

export function settingsGet(key: string) {
	return db.select().from(settings).where(eq(settings.key, key)).get();
}

export function settingsUpsert(key: string, value: string) {
	return db
		.insert(settings)
		.values({ key, value })
		.onConflictDoUpdate({
			target: settings.key,
			set: { value },
		})
		.run();
}
