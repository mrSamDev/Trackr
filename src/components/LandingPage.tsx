import { Link } from "@tanstack/react-router";
import {
	BarChart3,
	Bot,
	Briefcase,
	CheckCircle2,
	Github,
	Layers,
	MousePointerClick,
	Search,
	Shield,
	Sparkles,
	Target,
	TrendingUp,
	Zap,
} from "lucide-react";
import { Button } from "#/components/ui/button";

function FeatureCard({
	icon,
	title,
	description,
	color,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
	color: string;
}) {
	return (
		<div className="panel card-hover rise-in flex flex-col gap-4">
			<div
				className="w-12 h-12 rounded-2xl border-[3px] border-[var(--ink)] flex items-center justify-center"
				style={{ backgroundColor: color }}
			>
				{icon}
			</div>
			<h3 className="display-sub">{title}</h3>
			<p className="text-[var(--ink-60)] text-sm leading-relaxed">
				{description}
			</p>
		</div>
	);
}

function StepCard({
	num,
	title,
	description,
}: {
	num: string;
	title: string;
	description: string;
}) {
	return (
		<div className="flex flex-col items-center text-center gap-4 rise-in">
			<div className="w-14 h-14 rounded-full border-[3px] border-[var(--ink)] bg-[var(--yellow)] flex items-center justify-center">
				<span className="display-card text-[var(--ink)]">{num}</span>
			</div>
			<h3 className="display-sub">{title}</h3>
			<p className="text-[var(--ink-60)] text-sm max-w-[260px]">
				{description}
			</p>
		</div>
	);
}

export function LandingPage() {
	return (
		<div className="overflow-x-hidden">
			{/* Hero */}
			<section className="page-wrap pt-16 pb-20 md:pt-24 md:pb-28">
				<div className="flex flex-col items-center text-center gap-8">
					<div className="inline-flex items-center gap-2 rounded-full border-[3px] border-[var(--ink)] bg-[var(--panel)] px-4 py-2 label-caps text-[var(--ink-60)] rise-in">
						<Sparkles className="size-4 text-[var(--yellow)]" />
						Open source &amp; free forever
					</div>

					<h1
						className="display-hero max-w-[900px] rise-in"
						style={{ animationDelay: "100ms" }}
					>
						Track every application.
						<br />
						<span className="text-[var(--pink-cta-deep)]">
							Land your next job.
						</span>
					</h1>

					<p
						className="text-lg md:text-xl text-[var(--ink-60)] max-w-[560px] font-600 rise-in"
						style={{ animationDelay: "200ms" }}
					>
						A playful, powerful job application tracker with analytics, AI
						integration, and zero clutter.
					</p>

					<div
						className="flex flex-wrap items-center justify-center gap-4 rise-in"
						style={{ animationDelay: "300ms" }}
					>
						<Link to="/register">
							<Button className="rounded-full px-8 py-3 label-caps bg-[var(--ink)] text-white hover:bg-[var(--ink-80)] text-base">
								<Zap className="size-4 mr-2" />
								Get Started
							</Button>
						</Link>
						<Link to="/login">
							<Button
								variant="outline"
								className="rounded-full px-8 py-3 label-caps border-[3px] border-[var(--ink)] bg-[var(--panel)] hover:bg-[var(--ink-08)] text-base"
							>
								Sign In
							</Button>
						</Link>
					</div>

					{/* Hero visual — abstract app preview */}
					<div
						className="w-full max-w-[720px] mt-6 rise-in"
						style={{ animationDelay: "400ms" }}
					>
						<div className="panel p-4 md:p-6 relative overflow-hidden">
							<div className="absolute top-0 right-0 w-32 h-32 bg-[var(--mint)] rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2" />
							<div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--pink)] rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2" />

							<div className="relative flex items-center gap-3 mb-4">
								<div className="flex gap-1.5">
									<div className="w-3 h-3 rounded-full border-[2px] border-[var(--ink)] bg-[var(--yellow)]" />
									<div className="w-3 h-3 rounded-full border-[2px] border-[var(--ink)] bg-[var(--mint)]" />
									<div className="w-3 h-3 rounded-full border-[2px] border-[var(--ink)] bg-[var(--pink)]" />
								</div>
								<div className="h-3 w-24 rounded-full bg-[var(--ink-14)]" />
							</div>

							<div className="space-y-2">
								{[
									{
										title: "Senior Frontend Engineer",
										company: "Vercel",
										status: "Interview",
										color: "var(--mint)",
									},
									{
										title: "Full-Stack Developer",
										company: "Stripe",
										status: "Applied",
										color: "var(--bluey)",
									},
									{
										title: "Product Designer",
										company: "Figma",
										status: "Offer",
										color: "var(--yellow)",
									},
									{
										title: "Staff Engineer",
										company: "GitHub",
										status: "Rejected",
										color: "var(--destructive)",
									},
								].map((job, i) => (
									<div
										key={i}
										className="flex items-center justify-between rounded-2xl border-[3px] border-[var(--ink)] bg-[var(--panel-2)] px-4 py-3"
									>
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 rounded-xl border-[2px] border-[var(--ink)] bg-[var(--panel)] flex items-center justify-center text-xs font-800">
												{job.company[0]}
											</div>
											<div>
												<p className="text-sm font-800">{job.title}</p>
												<p className="text-xs text-[var(--ink-60)]">
													{job.company}
												</p>
											</div>
										</div>
										<span
											className="badge-text rounded-full px-2.5 py-1 text-white"
											style={{ backgroundColor: job.color }}
										>
											{job.status}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features */}
			<section className="page-wrap py-20 md:py-28">
				<div className="text-center mb-14">
					<p className="label-caps text-[var(--ink-60)] mb-3">Features</p>
					<h2 className="display-section">
						Everything you need to stay organized
					</h2>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					<FeatureCard
						icon={<Briefcase className="size-6 text-[var(--ink)]" />}
						title="Track Applications"
						description="Log every job you apply to with title, company, status, salary, location, and notes. Never lose track of an opportunity again."
						color="var(--yellow)"
					/>
					<FeatureCard
						icon={<BarChart3 className="size-6 text-[var(--ink)]" />}
						title="Analytics Dashboard"
						description="Visualize your job search with status funnels, weekly activity charts, top companies, and source breakdowns."
						color="var(--mint)"
					/>
					<FeatureCard
						icon={<Bot className="size-6 text-[var(--ink)]" />}
						title="AI Integration"
						description="Connect via MCP so Claude, Cursor, and other AI assistants can manage your applications directly from chat."
						color="var(--bluey)"
					/>
					<FeatureCard
						icon={<Shield className="size-6 text-[var(--ink)]" />}
						title="Secure Auth"
						description="Sign in with GitHub OAuth or email. Your data stays local in SQLite and under your control."
						color="var(--pink)"
					/>
					<FeatureCard
						icon={<Search className="size-6 text-[var(--ink)]" />}
						title="Smart Search"
						description="Filter and sort by status, company, or role. Find any application in seconds with instant search."
						color="var(--yellow)"
					/>
					<FeatureCard
						icon={<Layers className="size-6 text-[var(--ink)]" />}
						title="Customizable Fields"
						description="Choose which columns appear in your table. Tailor the tracker to match your personal workflow."
						color="var(--mint)"
					/>
				</div>
			</section>

			{/* How it works */}
			<section className="page-wrap py-20 md:py-28">
				<div className="panel">
					<div className="text-center mb-14">
						<p className="label-caps text-[var(--ink-60)] mb-3">How it works</p>
						<h2 className="display-section">
							Three steps to job-search clarity
						</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
						<StepCard
							num="1"
							title="Log Applications"
							description="Add jobs as you apply with one click. Capture role, company, URL, and anything else you need."
						/>
						<StepCard
							num="2"
							title="Update Status"
							description="Move applications through your pipeline: Applied → Interview → Offer. Keep everything current."
						/>
						<StepCard
							num="3"
							title="Analyze &amp; Improve"
							description="Visit the analytics dashboard to see what's working, then double down on your best sources."
						/>
					</div>
				</div>
			</section>

			{/* MCP / AI Section */}
			<section className="page-wrap py-20 md:py-28">
				<div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
					<div className="flex-1">
						<p className="label-caps text-[var(--ink-60)] mb-3">MCP Server</p>
						<h2 className="display-section mb-4">
							Let AI manage your pipeline
						</h2>
						<p className="text-[var(--ink-60)] mb-6 leading-relaxed">
							Trackr ships with a built-in Model Context Protocol server.
							Connect Claude, Cursor, or any MCP-compatible assistant and ask it
							to add jobs, update statuses, or generate reports — all in natural
							language.
						</p>
						<ul className="space-y-3">
							{[
								"List all applications with interview status",
								"Add a new job at Stripe for Staff Engineer",
								"Mark application #42 as rejected",
								"Show me my top application sources",
							].map((item) => (
								<li
									key={item}
									className="flex items-start gap-3 text-sm font-600"
								>
									<CheckCircle2 className="size-5 text-[var(--mint)] shrink-0 mt-0.5" />
									{item}
								</li>
							))}
						</ul>
					</div>
					<div className="flex-1 w-full max-w-[400px]">
						<div className="panel p-5 space-y-3">
							<div className="flex items-center gap-2 mb-2">
								<div className="w-8 h-8 rounded-full bg-[var(--ink)] flex items-center justify-center">
									<Bot className="size-4 text-white" />
								</div>
								<span className="label-caps">AI Assistant</span>
							</div>
							{[
								{
									sender: "user",
									text: "I just got an offer from Vercel — update that application.",
								},
								{
									sender: "ai",
									text: "Done! Updated Vercel — Senior Frontend Engineer to Offer status.",
								},
								{
									sender: "user",
									text: "How many interviews do I have next week?",
								},
								{
									sender: "ai",
									text: "You have 3 upcoming interviews: Vercel, Stripe, and Linear.",
								},
							].map((msg, i) => (
								<div
									key={i}
									className={`rounded-2xl border-[3px] border-[var(--ink)] px-4 py-3 text-sm ${
										msg.sender === "user"
											? "bg-[var(--panel-2)] ml-6"
											: "bg-[var(--mint)] mr-6"
									}`}
								>
									{msg.text}
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Stats / Social proof bar */}
			<section className="page-wrap py-16">
				<div className="panel flex flex-col md:flex-row items-center justify-around gap-8 text-center">
					<div>
						<div className="display-card text-[var(--bluey)]">100%</div>
						<p className="label-caps text-[var(--ink-60)]">Open Source</p>
					</div>
					<div className="hidden md:block w-[2px] h-12 bg-[var(--ink-14)]" />
					<div>
						<div className="display-card text-[var(--mint)]">0$</div>
						<p className="label-caps text-[var(--ink-60)]">Free Forever</p>
					</div>
					<div className="hidden md:block w-[2px] h-12 bg-[var(--ink-14)]" />
					<div>
						<div className="display-card text-[var(--pink-cta-deep)]">
							Self-hosted
						</div>
						<p className="label-caps text-[var(--ink-60)]">Your Data</p>
					</div>
				</div>
			</section>

			{/* Tech stack */}
			<section className="page-wrap py-20 md:py-28">
				<div className="text-center mb-12">
					<p className="label-caps text-[var(--ink-60)] mb-3">Built with</p>
					<h2 className="display-section">A modern stack you can trust</h2>
				</div>

				<div className="flex flex-wrap justify-center gap-3">
					{[
						"TanStack Start",
						"React 19",
						"tRPC",
						"Better Auth",
						"SQLite",
						"Tailwind CSS",
						"shadcn/ui",
						"Recharts",
					].map((tech) => (
						<span
							key={tech}
							className="badge-text rounded-full px-4 py-2 border-[3px] border-[var(--ink)] bg-[var(--panel)]"
						>
							{tech}
						</span>
					))}
				</div>
			</section>

			{/* CTA */}
			<section className="page-wrap py-20 md:py-28">
				<div className="panel text-center flex flex-col items-center gap-6">
					<Target className="size-12 text-[var(--pink-cta-deep)]" />
					<h2 className="display-section max-w-[500px]">
						Ready to land your next role?
					</h2>
					<p className="text-[var(--ink-60)] max-w-[420px]">
						Join thousands of developers who track smarter, interview better,
						and get hired faster.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<Link to="/register">
							<Button className="rounded-full px-8 py-3 label-caps bg-[var(--ink)] text-white hover:bg-[var(--ink-80)] text-base">
								<MousePointerClick className="size-4 mr-2" />
								Create Free Account
							</Button>
						</Link>
						<a
							href="https://github.com/mrsamdev/trackr"
							target="_blank"
							rel="noreferrer"
						>
							<Button
								variant="outline"
								className="rounded-full px-8 py-3 label-caps border-[3px] border-[var(--ink)] bg-[var(--panel)] hover:bg-[var(--ink-08)] text-base"
							>
								<Github className="size-4 mr-2" />
								Star on GitHub
							</Button>
						</a>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="page-wrap py-12 border-t-[3px] border-[var(--ink-14)]">
				<div className="flex flex-col md:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<TrendingUp className="size-5 text-[var(--ink)]" />
						<span className="label-caps">Trackr</span>
					</div>
					<p className="text-sm text-[var(--ink-60)]">
						© {new Date().getFullYear()} Trackr. MIT License.
					</p>
					<div className="flex items-center gap-4">
						<a
							href="https://github.com/mrsamdev/trackr"
							target="_blank"
							rel="noreferrer"
							className="text-[var(--ink-60)] hover:text-[var(--ink)] transition-colors"
						>
							<Github className="size-5" />
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}
