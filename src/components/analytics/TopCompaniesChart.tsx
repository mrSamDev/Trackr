import {
	Bar,
	BarChart,
	LabelList,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";
import type { CompanyBucket } from "#/integrations/trpc/types";

interface TopCompaniesChartProps {
	data: CompanyBucket[];
}

export function TopCompaniesChart({ data }: TopCompaniesChartProps) {
	return (
		<div className="panel p-5">
			<div className="display-sub mb-4">Top Companies</div>
			{data.length === 0 ? (
				<div className="h-[200px] flex items-center justify-center label-caps text-[var(--ink-60)]">
					No company data yet
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
							dataKey="company"
							width={90}
							tick={{ fontSize: 12, fontFamily: "Nunito", fill: "var(--ink)" }}
							axisLine={false}
							tickLine={false}
						/>
						<Bar dataKey="count" fill="var(--melon)" radius={6} maxBarSize={28}>
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
