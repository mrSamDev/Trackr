import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { WeekBucket } from "#/integrations/trpc/types";

function formatWeekLabel(week: string): string {
	// week is "YYYY-WW"
	const [yearStr, weekStr] = week.split("-");
	const year = Number.parseInt(yearStr, 10);
	const weekNum = Number.parseInt(weekStr, 10);
	const date = new Date(year, 0, 1 + (weekNum - 1) * 7);
	return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface WeeklyActivityChartProps {
	data: WeekBucket[];
}

export function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
	const chartData = data.map((d) => ({
		label: formatWeekLabel(d.week),
		count: d.count,
	}));

	return (
		<div className="panel p-5">
			<div className="display-sub mb-4">Weekly Activity</div>
			{chartData.length === 0 ? (
				<div className="h-[200px] flex items-center justify-center label-caps text-[var(--ink-60)]">
					No activity in the last 12 weeks
				</div>
			) : (
				<ResponsiveContainer width="100%" height={200}>
					<AreaChart
						data={chartData}
						margin={{ top: 4, right: 8, bottom: 0, left: -16 }}
					>
						<defs>
							<linearGradient id="blueyGrad" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="var(--bluey)" stopOpacity={0.3} />
								<stop offset="95%" stopColor="var(--bluey)" stopOpacity={0} />
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="var(--ink-08)"
							vertical={false}
						/>
						<XAxis
							dataKey="label"
							tick={{
								fontSize: 11,
								fontFamily: "Nunito",
								fill: "var(--ink-60)",
							}}
							axisLine={false}
							tickLine={false}
							interval="preserveStartEnd"
						/>
						<YAxis
							allowDecimals={false}
							tick={{
								fontSize: 11,
								fontFamily: "Nunito",
								fill: "var(--ink-60)",
							}}
							axisLine={false}
							tickLine={false}
						/>
						<Tooltip
							contentStyle={{
								borderRadius: 10,
								border: "2px solid var(--ink-14)",
								fontFamily: "Nunito",
								fontSize: 13,
								background: "var(--panel)",
							}}
							labelStyle={{ fontWeight: 700, color: "var(--ink)" }}
							itemStyle={{ color: "var(--bluey)" }}
						/>
						<Area
							type="monotone"
							dataKey="count"
							stroke="var(--bluey)"
							strokeWidth={2.5}
							fill="url(#blueyGrad)"
							dot={false}
							activeDot={{ r: 4, fill: "var(--bluey)" }}
						/>
					</AreaChart>
				</ResponsiveContainer>
			)}
		</div>
	);
}
