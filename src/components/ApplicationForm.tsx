import { useForm } from "@tanstack/react-form";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";
import type { Application } from "#/integrations/trpc/types";

type FormData = {
	title: string;
	company: string;
	status: "applied" | "interview" | "rejected" | "offer";
	applied_at: string;
	location: string;
	salary: string;
	job_url: string;
	source: string;
	notes: string;
};

interface Props {
	initialData?: Partial<Application>;
	visibleFields: string[];
	onSubmit: (data: FormData) => void;
	onDelete?: () => void;
	isPending?: boolean;
}

export function ApplicationForm({
	initialData,
	visibleFields,
	onSubmit,
	onDelete,
	isPending,
}: Props) {
	const form = useForm({
		defaultValues: {
			title: initialData?.title ?? "",
			company: initialData?.company ?? "",
			status: initialData?.status ?? "applied",
			applied_at:
				initialData?.applied_at ?? new Date().toISOString().slice(0, 10),
			location: initialData?.location ?? "",
			salary: initialData?.salary ?? "",
			job_url: initialData?.job_url ?? "",
			source: initialData?.source ?? "",
			notes: initialData?.notes ?? "",
		} satisfies FormData,
		onSubmit: async ({ value }) => {
			onSubmit(value);
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				void form.handleSubmit();
			}}
			className="space-y-4"
		>
			<form.Field
				name="title"
				validators={{
					onChange: ({ value }) => {
						if (!value || value.length < 1) return "Title is required";
						return undefined;
					},
				}}
			>
				{(field) => (
					<div>
						<Label className="label-ui mb-1 block">Title *</Label>
						<Input
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							placeholder="e.g. Senior Frontend Engineer"
							className="select-input"
						/>
						{field.state.meta.errors?.[0] ? (
							<p className="text-[var(--destructive)] text-xs mt-1">
								{field.state.meta.errors[0]}
							</p>
						) : null}
					</div>
				)}
			</form.Field>

			<form.Field
				name="company"
				validators={{
					onChange: ({ value }) => {
						if (!value || value.length < 1) return "Company is required";
						return undefined;
					},
				}}
			>
				{(field) => (
					<div>
						<Label className="label-ui mb-1 block">Company *</Label>
						<Input
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							placeholder="e.g. Acme Corp"
							className="select-input"
						/>
						{field.state.meta.errors?.[0] ? (
							<p className="text-[var(--destructive)] text-xs mt-1">
								{field.state.meta.errors[0]}
							</p>
						) : null}
					</div>
				)}
			</form.Field>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<form.Field
					name="status"
					validators={{
						onChange: ({ value }) => {
							if (!value) return "Status is required";
							return undefined;
						},
					}}
				>
					{(field) => (
						<div>
							<Label className="label-ui mb-1 block">Status *</Label>
							<select
								value={field.state.value}
								onChange={(e) =>
									field.handleChange(e.target.value as FormData["status"])
								}
								className="select-input"
							>
								<option value="applied">Applied</option>
								<option value="interview">Interview</option>
								<option value="offer">Offer</option>
								<option value="rejected">Rejected</option>
							</select>
						</div>
					)}
				</form.Field>

				<form.Field
					name="applied_at"
					validators={{
						onChange: ({ value }) => {
							if (!value) return "Date is required";
							return undefined;
						},
					}}
				>
					{(field) => (
						<div>
							<Label className="label-ui mb-1 block">Applied Date *</Label>
							<Input
								type="date"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								className="select-input"
							/>
						</div>
					)}
				</form.Field>
			</div>

			{visibleFields.includes("location") && (
				<form.Field name="location">
					{(field) => (
						<div>
							<Label className="label-ui mb-1 block">Location</Label>
							<Input
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="e.g. Remote / New York"
								className="select-input"
							/>
						</div>
					)}
				</form.Field>
			)}

			{visibleFields.includes("salary") && (
				<form.Field name="salary">
					{(field) => (
						<div>
							<Label className="label-ui mb-1 block">Salary</Label>
							<Input
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="e.g. $120k - $150k"
								className="select-input"
							/>
						</div>
					)}
				</form.Field>
			)}

			{visibleFields.includes("job_url") && (
				<form.Field name="job_url">
					{(field) => (
						<div>
							<Label className="label-ui mb-1 block">Job URL</Label>
							<Input
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="https://..."
								className="select-input"
							/>
						</div>
					)}
				</form.Field>
			)}

			{visibleFields.includes("source") && (
				<form.Field name="source">
					{(field) => (
						<div>
							<Label className="label-ui mb-1 block">Source</Label>
							<Input
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="e.g. LinkedIn, Referral"
								className="select-input"
							/>
						</div>
					)}
				</form.Field>
			)}

			{visibleFields.includes("notes") && (
				<form.Field name="notes">
					{(field) => (
						<div>
							<Label className="label-ui mb-1 block">Notes</Label>
							<Textarea
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Any notes about this application..."
								rows={3}
								className="select-input"
							/>
						</div>
					)}
				</form.Field>
			)}

			<div className="flex items-center justify-between gap-3 pt-2">
				<div>
					{onDelete && (
						<Button
							type="button"
							variant="destructive"
							onClick={() => {
								if (
									window.confirm(
										"Are you sure you want to delete this application?",
									)
								) {
									onDelete();
								}
							}}
						>
							Delete
						</Button>
					)}
				</div>
				<div className="flex items-center gap-3">
					<Button
						type="submit"
						disabled={isPending}
						className="rounded-full px-6"
					>
						{isPending ? "Saving..." : "Save"}
					</Button>
				</div>
			</div>
		</form>
	);
}
