import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useTransition } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { signIn } from "#/lib/auth-client";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function GithubIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			className="size-4"
			aria-hidden="true"
		>
			<path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
		</svg>
	);
}

function LoginPage() {
	const navigate = useNavigate();
	const [serverError, setServerError] = useState("");
	const [isGithubPending, startGithubTransition] = useTransition();

	const form = useForm({
		defaultValues: { email: "", password: "" },
		onSubmit: async ({ value }) => {
			setServerError("");
			try {
				const result = await signIn.email(value);
				if (result.error) {
					console.error("sign-in error", result.error);
					setServerError(
						result.error.message ||
							result.error.statusText ||
							"Invalid email or password.",
					);
				} else {
					navigate({ to: "/" });
				}
			} catch (err) {
				console.error("sign-in exception", err);
				setServerError(
					err instanceof Error
						? err.message
						: "Something went wrong. Please try again.",
				);
			}
		},
	});

	function handleGithub() {
		setServerError("");
		startGithubTransition(async () => {
			await signIn.social({ provider: "github", callbackURL: "/" });
		});
	}

	return (
		<div className="min-h-screen flex items-center justify-center px-4 py-12">
			<div className="w-full max-w-sm">
				<div className="text-center mb-8">
					<h1 className="display-card mb-1">Job Tracker</h1>
					<p className="label-caps text-(--ink-60)">Sign in to your account</p>
				</div>

				<div className="panel rise-in">
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="flex flex-col gap-5"
					>
						<form.Field name="email">
							{(field) => (
								<div className="flex flex-col gap-1.5">
									<Label htmlFor="email" className="label-ui">
										Email
									</Label>
									<Input
										id="email"
										type="email"
										autoComplete="email"
										placeholder="you@example.com"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										required
										className="rounded-2xl border-[3px] border-(--ink) bg-(--panel-2)"
									/>
								</div>
							)}
						</form.Field>

						<form.Field name="password">
							{(field) => (
								<div className="flex flex-col gap-1.5">
									<Label htmlFor="password" className="label-ui">
										Password
									</Label>
									<Input
										id="password"
										type="password"
										autoComplete="current-password"
										placeholder="••••••••"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										required
										className="rounded-2xl border-[3px] border-(--ink) bg-(--panel-2)"
									/>
								</div>
							)}
						</form.Field>

						{serverError && (
							<p className="text-sm font-700 text-destructive bg-(--destructive)/10 rounded-xl px-3 py-2">
								{serverError}
							</p>
						)}

						<form.Subscribe selector={(state) => state.isSubmitting}>
							{(isSubmitting) => (
								<Button
									type="submit"
									disabled={isSubmitting}
									className="w-full rounded-full label-caps bg-(--ink) text-white hover:bg-(--ink-80) py-3 disabled:opacity-50"
								>
									{isSubmitting ? "Signing in…" : "Sign in"}
								</Button>
							)}
						</form.Subscribe>
					</form>

					<div className="flex items-center gap-3 my-5">
						<div className="flex-1 h-[2px] bg-(--ink-14)" />
						<span className="label-caps text-(--ink-60) text-[0.7rem]">or</span>
						<div className="flex-1 h-[2px] bg-(--ink-14)" />
					</div>

					<Button
						type="button"
						variant="outline"
						onClick={handleGithub}
						disabled={isGithubPending}
						className="w-full rounded-full label-caps border-[3px] border-(--ink) bg-(--panel-2) hover:bg-(--ink-08) py-3 disabled:opacity-50 flex items-center justify-center gap-2"
					>
						<GithubIcon />
						{isGithubPending ? "Redirecting…" : "Continue with GitHub"}
					</Button>
				</div>

				<p className="text-center mt-6 text-sm font-600 text-(--ink-60)">
					Don't have an account?{" "}
					<Link
						to="/register"
						className="text-(--ink) font-800 hover:underline underline-offset-2"
					>
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
}
