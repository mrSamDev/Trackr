import {
	Bar,
	BarChart,
	LabelList,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";
import type { SourceBucket } from "#/integrations/trpc/types";

interface SourceBreakdownChartProps {
	data: SourceBucket[];
}

export function SourceBreakdownChart({ data }: SourceBreakdownChartProps) {
	return (
		<div className="panel p-5">
			<div className="display-sub mb-4">Top Sources</div>
			{data.length === 0 ? (
				<div className="h-[200px] flex items-center justify-center label-caps text-[var(--ink-60)]">
					No source data recorded
				</div>
			) : (
				<ResponsiveContainer
					width="100%"
					height={Math.max(160, data.length * 44)}
				>
					<BarChart
						data={data}
						layout="vertical"
						margin={{ top: 0, right: 48, bottom: 0, left: 0 }}
					>
						<XAxis type="number" hide />
						<YAxis
							type="category"
							dataKey="source"
							width={90}
							tick={{ fontSize: 12, fontFamily: "Nunito", fill: "var(--ink)" }}
							axisLine={false}
							tickLine={false}
						/>
						<Bar
							dataKey="count"
							fill="var(--pink-cta)"
							radius={6}
							maxBarSize={28}
						>
							<LabelList
								dataKey="count"
								position="right"
								style={{
									fontSize: 13,
									fontFamily: "Nunito",
									fontWeight: 700,
									fill: "var(--ink)",
								}}
							/>
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			)}
		</div>
	);
}
