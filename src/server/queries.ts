import { db } from "#/server/db";

// ─── Applications ────────────────────────────────────────────────────────────

export function appGetById(id: number) {
	return db.prepare("SELECT * FROM applications WHERE id = ?").get(id);
}

export function appGetHeardBackAt(id: number) {
	return db
		.prepare("SELECT heard_back_at FROM applications WHERE id = ?")
		.get(id);
}

export function appList(opts: {
	status?: string;
	search?: string;
	limit?: number;
} = {}) {
	const conditions: string[] = [];
	const params: (string | number)[] = [];

	if (opts.status) {
		conditions.push("status = ?");
		params.push(opts.status);
	}
	if (opts.search?.trim()) {
		conditions.push("(title LIKE ? OR company LIKE ?)");
		const like = `%${opts.search.trim()}%`;
		params.push(like, like);
	}

	const where =
		conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
	const limitClause = opts.limit !== undefined ? " LIMIT ?" : "";
	if (opts.limit !== undefined) params.push(opts.limit);

	return db
		.prepare(
			`SELECT * FROM applications ${where} ORDER BY created_at DESC${limitClause}`,
		)
		.all(...params);
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
		.prepare(
			`INSERT INTO applications
        (title, company, status, applied_at, heard_back_at, location, salary, job_url, source, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING *`,
		)
		.get(
			params.title,
			params.company,
			params.status,
			params.applied_at,
			params.heard_back_at,
			params.location,
			params.salary,
			params.job_url,
			params.source,
			params.notes,
			params.now,
			params.now,
		);
}

// setEntries: already-filtered [column, value] pairs including updated_at
export function appUpdate(id: number, setEntries: Array<[string, unknown]>) {
	const setClause = setEntries.map(([k]) => `${k} = ?`).join(", ");
	const values = setEntries.map(([, v]) => v ?? null);
	return db
		.prepare(
			`UPDATE applications SET ${setClause} WHERE id = ? RETURNING *`,
		)
		.get(...values, id);
}

export function appUpdateStatus(
	id: number,
	status: string,
	heard_back_at: string | null,
	now: string,
) {
	return db
		.prepare(
			`UPDATE applications
       SET status = ?, heard_back_at = ?, updated_at = ?
       WHERE id = ?
       RETURNING *`,
		)
		.get(status, heard_back_at, now, id);
}

export function appDelete(id: number) {
	return db.prepare("DELETE FROM applications WHERE id = ?").run(id);
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export function analyticsStatusCounts() {
	return db
		.prepare(
			`SELECT COUNT(*) AS total,
        SUM(CASE WHEN status='applied'   THEN 1 ELSE 0 END) AS applied,
        SUM(CASE WHEN status='interview' THEN 1 ELSE 0 END) AS interview,
        SUM(CASE WHEN status='rejected'  THEN 1 ELSE 0 END) AS rejected,
        SUM(CASE WHEN status='offer'     THEN 1 ELSE 0 END) AS offer
      FROM applications`,
		)
		.get();
}

export function analyticsAvgResponseDays() {
	return db
		.prepare(
			`SELECT AVG(CAST(julianday(heard_back_at) - julianday(applied_at) AS REAL)) AS avg_days
      FROM applications
      WHERE heard_back_at IS NOT NULL AND applied_at IS NOT NULL`,
		)
		.get();
}

export function analyticsWeeklyActivity() {
	return db
		.prepare(
			`SELECT strftime('%Y-%W', applied_at) AS week, COUNT(*) AS count
      FROM applications
      WHERE applied_at >= date('now', '-84 days')
      GROUP BY week ORDER BY week ASC`,
		)
		.all();
}

export function analyticsTopSources() {
	return db
		.prepare(
			`SELECT source, COUNT(*) AS count FROM applications
      WHERE source IS NOT NULL AND source != ''
      GROUP BY source ORDER BY count DESC LIMIT 5`,
		)
		.all();
}

export function analyticsTopCompanies() {
	return db
		.prepare(
			`SELECT company, COUNT(*) AS count FROM applications
      GROUP BY company ORDER BY count DESC LIMIT 5`,
		)
		.all();
}

// ─── Settings ────────────────────────────────────────────────────────────────

export function settingsGet(key: string) {
	return db.prepare("SELECT value FROM settings WHERE key = ?").get(key);
}

export function settingsUpsert(key: string, value: string) {
	return db
		.prepare(
			`INSERT INTO settings (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
		)
		.run(key, value);
}
