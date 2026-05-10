import { TRPCError } from "@trpc/server";

type Bucket = {
	tokens: number;
	lastRefill: number;
};

const store = new Map<string, Bucket>();

const cleanUpInterval = setInterval(() => {
	const now = Date.now();
	const expiry = now - 60_000;
	for (const [key, bucket] of store) {
		if (bucket.lastRefill < expiry) store.delete(key);
	}
}, 60_000);

if (typeof window !== "undefined") {
	clearInterval(cleanUpInterval);
}

function getIp(request: Request): string {
	const forwarded =
		request.headers.get("x-forwarded-for") ??
		request.headers.get("x-real-ip") ??
		"127.0.0.1";
	return forwarded.split(",")[0]?.trim() ?? "127.0.0.1";
}

function consume(key: string, maxTokens: number, windowMs: number): boolean {
	const now = Date.now();
	const bucket = store.get(key);
	if (!bucket) {
		store.set(key, { tokens: maxTokens - 1, lastRefill: now });
		return true;
	}
	const elapsed = now - bucket.lastRefill;
	const refillRate = maxTokens / windowMs;
	bucket.tokens = Math.min(maxTokens, bucket.tokens + elapsed * refillRate);
	bucket.lastRefill = now;
	if (bucket.tokens < 1) return false;
	bucket.tokens -= 1;
	return true;
}

export function checkRateLimit(
	request: Request,
	opts: {
		max: number;
		windowMs?: number;
		prefix?: string;
	},
): void {
	const ip = getIp(request);
	const key = `${opts.prefix ?? "rl"}:${ip}`;
	const windowMs = opts.windowMs ?? 60_000;
	const allowed = consume(key, opts.max, windowMs);
	if (!allowed) {
		throw new TRPCError({
			code: "TOO_MANY_REQUESTS",
			message: "Rate limit exceeded. Please try again later.",
		});
	}
}

export function checkMcpRateLimit(request: Request): void {
	checkRateLimit(request, { max: 30, prefix: "mcp" });
}

export function checkAuthRateLimit(request: Request): void {
	checkRateLimit(request, { max: 20, prefix: "auth" });
}

export function checkTrpcRateLimit(request: Request): void {
	checkRateLimit(request, { max: 100, prefix: "trpc" });
}
