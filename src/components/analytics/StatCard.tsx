type Accent = "mint" | "yellow" | "bluey" | "pink" | "melon";

const ACCENT_COLORS: Record<Accent, string> = {
	mint: "var(--mint)",
	yellow: "var(--yellow)",
	bluey: "var(--bluey)",
	pink: "var(--pink-cta)",
	melon: "var(--melon)",
};

interface StatCardProps {
	label: string;
	value: string | number;
	icon: React.ReactNode;
	accent?: Accent;
}

export function StatCard({
	label,
	value,
	icon,
	accent = "bluey",
}: StatCardProps) {
	const color = ACCENT_COLORS[accent];
	return (
		<div className="panel p-5 flex flex-col gap-3">
			<div
				className="size-9 rounded-full flex items-center justify-center"
				style={{ backgroundColor: color }}
			>
				<span className="size-4 text-[var(--ink)] [&>svg]:size-4">{icon}</span>
			</div>
			<div>
				<div className="display-section leading-none">{value}</div>
				<div className="label-caps text-[var(--ink-60)] mt-1">{label}</div>
			</div>
		</div>
	);
}
