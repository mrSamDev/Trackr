import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { signUp } from "#/lib/auth-client";

export const Route = createFileRoute("/register")({
	component: RegisterPage,
});

function RegisterPage() {
	const navigate = useNavigate();
	const [serverError, setServerError] = useState("");

	const form = useForm({
		defaultValues: { name: "", email: "", password: "" },
		onSubmit: async ({ value }) => {
			setServerError("");
			try {
				const result = await signUp.email(value);
				if (result.error) {
					console.error("sign-up error", result.error);
					setServerError(
						result.error.message ||
							result.error.statusText ||
							"Something went wrong. Please try again.",
					);
				} else {
					navigate({ to: "/" });
				}
			} catch (err) {
				console.error("sign-up exception", err);
				setServerError(
					err instanceof Error
						? err.message
						: "Something went wrong. Please try again.",
				);
			}
		},
	});

	return (
		<div className="min-h-screen flex items-center justify-center px-4 py-12">
			<div className="w-full max-w-sm">
				<div className="text-center mb-8">
					<h1 className="display-card mb-1">Job Tracker</h1>
					<p className="label-caps text-(--ink-60)">Create your account</p>
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
						<form.Field name="name">
							{(field) => (
								<div className="flex flex-col gap-1.5">
									<Label htmlFor="name" className="label-ui">
										Name
									</Label>
									<Input
										id="name"
										type="text"
										autoComplete="name"
										placeholder="Your name"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										required
										className="rounded-2xl border-[3px] border-(--ink) bg-(--panel-2)"
									/>
								</div>
							)}
						</form.Field>

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
										<span className="ml-1.5 text-[0.7rem] font-600 text-(--ink-60)">
											(min 8 chars)
										</span>
									</Label>
									<Input
										id="password"
										type="password"
										autoComplete="new-password"
										placeholder="••••••••"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										required
										minLength={8}
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
									className="w-full rounded-full label-caps bg-(--pink-cta) text-white hover:bg-(--pink-cta-deep) py-3 disabled:opacity-50"
								>
									{isSubmitting ? "Creating account…" : "Create account"}
								</Button>
							)}
						</form.Subscribe>
					</form>
				</div>

				<p className="text-center mt-6 text-sm font-600 text-(--ink-60)">
					Already have an account?{" "}
					<Link
						to="/login"
						className="text-(--ink) font-800 hover:underline underline-offset-2"
					>
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
}
