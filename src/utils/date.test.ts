import { describe, expect, it } from "vitest";
import { daysSince } from "./date";

describe("daysSince", () => {
	it("returns 0 for today", () => {
		const today = new Date().toISOString();
		expect(daysSince(today)).toBe(0);
	});

	it("returns 1 for yesterday", () => {
		const yesterday = new Date(Date.now() - 86400000).toISOString();
		expect(daysSince(yesterday)).toBe(1);
	});

	it("returns 7 for a week ago", () => {
		const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
		expect(daysSince(weekAgo)).toBe(7);
	});

	it("handles date strings without time", () => {
		const yesterday = new Date(Date.now() - 86400000)
			.toISOString()
			.split("T")[0];
		expect(daysSince(yesterday)).toBeGreaterThanOrEqual(0);
	});
});
