export function daysSince(dateString: string): number {
	const applied = new Date(dateString);
	const now = new Date();
	return Math.floor(
		(now.getTime() - applied.getTime()) / (1000 * 60 * 60 * 24),
	);
}
