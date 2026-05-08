import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	BarChart2,
	Briefcase,
	Clock,
	Plus,
	Star,
	TrendingUp,
	Zap,
} from "lucide-react";
import { SourceBreakdownChart } from "#/components/analytics/SourceBreakdownChart";
import { StatCard } from "#/components/analytics/StatCard";
import { StatusFunnelChart } from "#/components/analytics/StatusFunnelChart";
import { TopCompaniesChart } from "#/components/analytics/TopCompaniesChart";
import { WeeklyActivityChart } from "#/components/analytics/WeeklyActivityChart";
import { Button } from "#/components/ui/button";
import { useTRPC } from "#/integrations/trpc/react";

export const Route = createFileRoute("/analytics")({
	component: AnalyticsPage,
});

function AnalyticsPage() {
	const trpc = useTRPC();
	const { data, isLoading } = useQuery(
		trpc.applications.analytics.queryOptions(),
	);

	if (isLoading) {
		return (
			<div className="page-wrap py-8">
				<div className="flex items-center gap-3 mb-8">
					<div className="size-10 rounded-full bg-[var(--ink-14)] animate-pulse" />
					<div className="h-8 w-36 bg-[var(--ink-14)] rounded-full animate-pulse" />
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
					{["total", "interview", "offer", "response", "active"].map((k) => (
						<div key={k} className="panel h-28 animate-pulse" />
					))}
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{["status", "weekly", "sources", "companies"].map((k) => (
						<div key={k} className="panel h-64 animate-pulse" />
					))}
				</div>
			</div>
		);
	}

	if (!data || data.total === 0) {
		return (
			<div className="page-wrap py-8">
				<header className="flex items-center gap-3 mb-8">
					<Link to="/">
						<Button
							variant="outline"
							size="icon"
							className="rounded-full border-[3px] border-[var(--ink)] bg-[var(--panel)]"
						>
							<ArrowLeft className="size-4" />
						</Button>
					</Link>
					<h1 className="display-section">Analytics</h1>
				</header>
				<div className="panel text-center py-20 rise-in">
					<div className="mb-4 flex justify-center text-[var(--ink-60)]">
						<BarChart2 className="size-12" />
					</div>
					<div className="display-card mb-4">No data yet</div>
					<p className="text-[var(--ink-60)] mb-6">
						Add some applications to see your job search analytics.
					</p>
					<Link to="/new">
						<Button className="rounded-full px-6 py-3 label-caps bg-[var(--ink)] text-white hover:bg-[var(--ink-80)]">
							<Plus className="size-4 mr-1" />
							Add Job
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="page-wrap py-8">
			<header className="flex items-center gap-3 mb-8">
				<Link to="/">
					<Button
						variant="outline"
						size="icon"
						className="rounded-full border-[3px] border-[var(--ink)] bg-[var(--panel)]"
					>
						<ArrowLeft className="size-4" />
					</Button>
				</Link>
				<h1 className="display-section">Analytics</h1>
			</header>

			{/* Stat Cards */}
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8 rise-in">
				<StatCard
					label="Total Applications"
					value={data.total}
					icon={<Briefcase />}
					accent="bluey"
				/>
				<StatCard
					label="Interview Rate"
					value={`${data.interviewRate}%`}
					icon={<TrendingUp />}
					accent="mint"
				/>
				<StatCard
					label="Offer Rate"
					value={`${data.offerRate}%`}
					icon={<Star />}
					accent="yellow"
				/>
				<StatCard
					label="Avg Response"
					value={
						data.avgResponseDays != null ? `${data.avgResponseDays}d` : "—"
					}
					icon={<Clock />}
					accent="melon"
				/>
				<StatCard
					label="Active"
					value={data.active}
					icon={<Zap />}
					accent="pink"
				/>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 rise-in">
				<StatusFunnelChart data={data.statusCounts} />
				<WeeklyActivityChart data={data.weeklyActivity} />
				<SourceBreakdownChart data={data.topSources} />
				<TopCompaniesChart data={data.topCompanies} />
			</div>
		</div>
	);
}
