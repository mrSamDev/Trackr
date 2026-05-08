import {
	Bar,
	BarChart,
	Cell,
	LabelList,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

interface StatusFunnelChartProps {
	data: {
		applied: number;
		interview: number;
		rejected: number;
		offer: number;
	};
}

const STATUS_DATA = [
	{ name: "Applied", key: "applied" as const, fill: "var(--bluey)" },
	{ name: "Interview", key: "interview" as const, fill: "var(--mint)" },
	{ name: "Offer", key: "offer" as const, fill: "var(--yellow)" },
	{ name: "Rejected", key: "rejected" as const, fill: "var(--destructive)" },
];

export function StatusFunnelChart({ data }: StatusFunnelChartProps) {
	const chartData = STATUS_DATA.map((s) => ({
		name: s.name,
		value: data[s.key],
		fill: s.fill,
	}));

	return (
		<div className="panel p-5">
			<div className="display-sub mb-4">Status Breakdown</div>
			<ResponsiveContainer width="100%" height={200}>
				<BarChart
					data={chartData}
					layout="vertical"
					margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
				>
					<XAxis type="number" hide />
					<YAxis
						type="category"
						dataKey="name"
						width={70}
						tick={{ fontSize: 13, fontFamily: "Nunito", fill: "var(--ink)" }}
						axisLine={false}
						tickLine={false}
					/>
					<Bar dataKey="value" radius={6} maxBarSize={28}>
						{chartData.map((entry) => (
							<Cell key={entry.name} fill={entry.fill} />
						))}
						<LabelList
							dataKey="value"
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
		</div>
	);
}
