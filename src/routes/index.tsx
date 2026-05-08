import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { BarChart2, Plus, Search, Settings } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { useTRPC } from "#/integrations/trpc/react";
import type { Application } from "#/integrations/trpc/types";

const ALL_STATUSES = [
	"all",
	"applied",
	"interview",
	"rejected",
	"offer",
] as const;
type StatusFilter = (typeof ALL_STATUSES)[number];

const ALL_OPTIONAL_FIELDS = [
	"location",
	"salary",
	"job_url",
	"source",
	"notes",
] as const;

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
	applied: { bg: "var(--bluey)", text: "#ffffff" },
	interview: { bg: "var(--mint)", text: "var(--ink)" },
	offer: { bg: "var(--yellow)", text: "var(--ink)" },
	rejected: { bg: "var(--destructive)", text: "#ffffff" },
};

function daysSince(dateString: string): number {
	const applied = new Date(dateString);
	const now = new Date();
	return Math.floor(
		(now.getTime() - applied.getTime()) / (1000 * 60 * 60 * 24),
	);
}

function useDebounce<T>(value: T, delay: number): T {
	const [debounced, setDebounced] = useState(value);
	useEffect(() => {
		const timer = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(timer);
	}, [value, delay]);
	return debounced;
}

const columnHelper = createColumnHelper<Application>();

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const trpc = useTRPC();
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const debouncedSearch = useDebounce(search, 300);
	const [sorting, setSorting] = useState<SortingState>([]);

	const listQuery = useQuery(
		trpc.applications.list.queryOptions({
			search: debouncedSearch || undefined,
			status: statusFilter === "all" ? undefined : statusFilter,
		}),
	);

	const settingsQuery = useQuery(trpc.settings.getVisibleFields.queryOptions());

	const visibleFields = useMemo(() => {
		if (!settingsQuery.data || settingsQuery.data.length === 0)
			return [...ALL_OPTIONAL_FIELDS];
		return settingsQuery.data.filter((f) =>
			ALL_OPTIONAL_FIELDS.includes(f as (typeof ALL_OPTIONAL_FIELDS)[number]),
		);
	}, [settingsQuery.data]);

	const columns = useMemo(() => {
		const cols = [
			columnHelper.accessor("title", {
				header: ({ column }) => (
					<button
						type="button"
						className="flex items-center gap-1 hover:opacity-70"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Title
						<span className="text-[10px]">↕</span>
					</button>
				),
			}),
			columnHelper.accessor("company", {
				header: ({ column }) => (
					<button
						type="button"
						className="flex items-center gap-1 hover:opacity-70"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Company
						<span className="text-[10px]">↕</span>
					</button>
				),
			}),
			columnHelper.accessor("status", {
				header: "Status",
				cell: ({ row }) => (
					<span
						className="badge-text inline-block rounded-full px-2.5 py-1"
						style={{
							backgroundColor: STATUS_COLORS[row.original.status].bg,
							color: STATUS_COLORS[row.original.status].text,
						}}
					>
						{row.original.status}
					</span>
				),
			}),
			columnHelper.accessor("applied_at", {
				header: ({ column }) => (
					<button
						type="button"
						className="flex items-center gap-1 hover:opacity-70"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Applied
						<span className="text-[10px]">↕</span>
					</button>
				),
			}),
			columnHelper.display({
				id: "days-since",
				header: "Days Since",
				cell: ({ row }) => daysSince(row.original.applied_at),
			}),
		];

		if (visibleFields.includes("location")) {
			cols.push(
				columnHelper.accessor("location", {
					header: "Location",
					cell: ({ row }) => (
						<span className="max-w-[120px] truncate block">
							{row.original.location}
						</span>
					),
				}),
			);
		}
		if (visibleFields.includes("salary")) {
			cols.push(
				columnHelper.accessor("salary", {
					header: "Salary",
					cell: ({ row }) => (
						<span className="max-w-[100px] truncate block">
							{row.original.salary}
						</span>
					),
				}),
			);
		}
		if (visibleFields.includes("job_url")) {
			cols.push(
				columnHelper.accessor("job_url", {
					header: "URL",
					cell: ({ row }) =>
						row.original.job_url ? (
							<a
								href={row.original.job_url}
								target="_blank"
								rel="noreferrer"
								className="text-[var(--bluey)] hover:underline"
							>
								Link
							</a>
						) : null,
				}),
			);
		}
		if (visibleFields.includes("source")) {
			cols.push(
				columnHelper.accessor("source", {
					header: "Source",
					cell: ({ row }) => (
						<span className="max-w-[100px] truncate block">
							{row.original.source}
						</span>
					),
				}),
			);
		}
		if (visibleFields.includes("notes")) {
			cols.push(
				columnHelper.accessor("notes", {
					header: "Notes",
					cell: ({ row }) => (
						<span className="max-w-[150px] truncate block">
							{row.original.notes}
						</span>
					),
				}),
			);
		}

		cols.push(
			columnHelper.display({
				id: "actions",
				header: "",
				cell: ({ row }) => (
					<Link
						to="/$id"
						params={{ id: String(row.original.id) }}
						className="text-[var(--bluey)] hover:underline text-sm font-bold"
					>
						Edit
					</Link>
				),
			}),
		);

		return cols;
	}, [visibleFields]);

	const table = useReactTable({
		data: (listQuery.data ?? []) as Application[],
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	const totalCount = listQuery.data?.length ?? 0;

	if (listQuery.isLoading) {
		return (
			<div className="page-wrap py-12">
				<div className="display-hero mb-8 animate-pulse">Job Applications</div>
				<div className="panel h-96 animate-pulse"></div>
			</div>
		);
	}

	return (
		<div className="page-wrap py-6">
			{/* Hero */}
			<div className="flex items-end justify-between gap-4 flex-wrap mb-8">
				<div>
					<h1 className="display-hero mb-2">Job Applications</h1>
					<p className="label-caps text-[var(--ink-60)]">
						{totalCount} application{totalCount !== 1 ? "s" : ""} tracked
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Link to="/analytics">
						<Button
							variant="outline"
							size="icon"
							className="rounded-full border-[3px] border-[var(--ink)] bg-[var(--panel)]"
						>
							<BarChart2 className="size-4" />
						</Button>
					</Link>
					<Link to="/settings">
						<Button
							variant="outline"
							size="icon"
							className="rounded-full border-[3px] border-[var(--ink)] bg-[var(--panel)]"
						>
							<Settings className="size-4" />
						</Button>
					</Link>
					<Link to="/new">
						<Button className="rounded-full px-5 py-2 label-caps bg-[var(--ink)] text-white hover:bg-[var(--ink-80)]">
							<Plus className="size-4 mr-1" />
							Add Job
						</Button>
					</Link>
				</div>
			</div>

			{/* Search + Filters */}
			<div className="flex flex-col sm:flex-row gap-4 mb-6 items-start">
				<div className="relative w-full sm:max-w-sm">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--ink-60)]" />
					<Input
						placeholder="Search title or company..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-10 rounded-full border-[3px] border-[var(--ink)] bg-[var(--panel-2)] select-input"
					/>
				</div>
				<div className="flex flex-wrap gap-2">
					{ALL_STATUSES.map((status) => (
						<button
							type="button"
							key={status}
							onClick={() => setStatusFilter(status)}
							className={`badge-text rounded-full px-3 py-1.5 border-[3px] transition-colors ${
								statusFilter === status
									? "bg-[var(--ink)] text-white border-[var(--ink)]"
									: "bg-[var(--panel-2)] text-[var(--ink)] border-[var(--ink-14)] hover:border-[var(--ink)]"
							}`}
						>
							{status === "all"
								? "All"
								: status[0].toUpperCase() + status.slice(1)}
						</button>
					))}
				</div>
			</div>

			{/* Table or Empty State */}
			{totalCount === 0 ? (
				<div className="panel text-center py-20 rise-in">
					<div className="display-card mb-4">No applications yet</div>
					<p className="text-[var(--ink-60)] mb-6">
						Track your job search by adding your first application.
					</p>
					<Link to="/new">
						<Button className="rounded-full px-6 py-3 label-caps bg-[var(--ink)] text-white hover:bg-[var(--ink-80)]">
							<Plus className="size-4 mr-1" />
							Add Job
						</Button>
					</Link>
				</div>
			) : (
				<div className="panel overflow-x-auto rise-in">
					<table className="w-full text-left min-w-[640px]">
						<thead>
							{table.getHeaderGroups().map((headerGroup) => (
								<tr
									key={headerGroup.id}
									className="border-b-2 border-[var(--ink-14)]"
								>
									{headerGroup.headers.map((header) => (
										<th
											key={header.id}
											className="py-3 pr-4 label-caps text-[var(--ink-60)] whitespace-nowrap"
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</th>
									))}
								</tr>
							))}
						</thead>
						<tbody>
							{table.getRowModel().rows.map((row) => (
								<tr
									key={row.id}
									className="border-b border-[var(--ink-08)] hover:bg-[var(--ink-08)] transition-colors"
								>
									{row.getVisibleCells().map((cell) => (
										<td
											key={cell.id}
											className="py-3 pr-4 text-sm whitespace-nowrap"
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
