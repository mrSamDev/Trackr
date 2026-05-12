import { betterAuth } from "better-auth";
import { initDb } from "#/server/db";

const githubProvider =
	process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
		? {
				github: {
					clientId: process.env.GITHUB_CLIENT_ID,
					clientSecret: process.env.GITHUB_CLIENT_SECRET,
				},
			}
		: {};

export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
	secret:
		process.env.BETTER_AUTH_SECRET ?? "dev-secret-please-change-in-production",
	database: initDb(),
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
		autoSignIn: true,
	},
	socialProviders: githubProvider,
});
