import { z } from "zod";

import {
	analyticsAvgResponseDays,
	analyticsStatusCounts,
	analyticsTopCompanies,
	analyticsTopSources,
	analyticsWeeklyActivity,
	appCreate,
	appDelete,
	appGetById,
	appList,
	appUpdate,
} from "#/server/queries";
import { createTRPCRouter, publicProcedure } from "./init";
import {
	type AnalyticsData,
	applicationInput,
	type CompanyBucket,
	getNowIso,
	parseApplicationRow,
	parseApplicationRows,
	type SourceBucket,
	type WeekBucket,
} from "./types";

export const applicationsRouter = createTRPCRouter({
	list: publicProcedure
		.input(
			z
				.object({
					search: z.string().optional(),
					status: z.string().optional(),
				})
				.optional(),
		)
		.query(({ input }) => {
			const rows = appList({ status: input?.status, search: input?.search });
			return parseApplicationRows(rows);
		}),

	get: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(({ input }) => {
			const row = appGetById(input.id);
			return row ? parseApplicationRow(row) : null;
		}),

	create: publicProcedure.input(applicationInput).mutation(({ input }) => {
		const now = getNowIso();
		const result = appCreate({
			title: input.title,
			company: input.company,
			status: input.status,
			applied_at: input.applied_at,
			heard_back_at: input.status !== "applied" ? now : null,
			location: input.location ?? null,
			salary: input.salary ?? null,
			job_url: input.job_url ?? null,
			source: input.source ?? null,
			notes: input.notes ?? null,
			now,
		});
		return parseApplicationRow(result);
	}),

	update: publicProcedure
		.input(
			z.object({
				id: z.number(),
				data: applicationInput.partial(),
			}),
		)
		.mutation(({ input }) => {
			const now = getNowIso();

			const existing = appGetById(input.id);
			if (!existing) throw new Error("Application not found");
			const existingApp = parseApplicationRow(existing);

			let heardBackAt = existingApp.heard_back_at;
			if (heardBackAt === null) {
				if (input.data.status && input.data.status !== "applied") {
					heardBackAt = now;
				} else if (!input.data.status && existingApp.status !== "applied") {
					heardBackAt = now;
				}
			}

			const fields: Array<[string, unknown]> = [
				["title", input.data.title],
				["company", input.data.company],
				["status", input.data.status],
				["applied_at", input.data.applied_at],
				["heard_back_at", heardBackAt],
				["location", input.data.location],
				["salary", input.data.salary],
				["job_url", input.data.job_url],
				["source", input.data.source],
				["notes", input.data.notes],
				["updated_at", now],
			];
			const setEntries = fields.filter(([, v]) => v !== undefined);

			const result = appUpdate(input.id, setEntries);
			return parseApplicationRow(result);
		}),

	delete: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(({ input }) => {
			appDelete(input.id);
			return { deleted: true };
		}),

	analytics: publicProcedure.query((): AnalyticsData => {
		const statusRow = analyticsStatusCounts() as {
			total: number;
			applied: number;
			interview: number;
			rejected: number;
			offer: number;
		};
		const respRow = analyticsAvgResponseDays() as { avg_days: number | null };
		const weeklyRows = analyticsWeeklyActivity() as WeekBucket[];
		const sourceRows = analyticsTopSources() as SourceBucket[];
		const companyRows = analyticsTopCompanies() as CompanyBucket[];

		const total = statusRow.total ?? 0;
		return {
			total,
			statusCounts: {
				applied: statusRow.applied,
				interview: statusRow.interview,
				rejected: statusRow.rejected,
				offer: statusRow.offer,
			},
			interviewRate:
				total > 0 ? Math.round((statusRow.interview / total) * 1000) / 10 : 0,
			offerRate:
				total > 0 ? Math.round((statusRow.offer / total) * 1000) / 10 : 0,
			avgResponseDays:
				respRow.avg_days != null
					? Math.round(respRow.avg_days * 10) / 10
					: null,
			active: statusRow.applied + statusRow.interview,
			weeklyActivity: weeklyRows,
			topSources: sourceRows,
			topCompanies: companyRows,
		};
	}),
});
