import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "#/components/ui/button";
import { useTRPC } from "#/integrations/trpc/react";

const ALL_OPTIONAL_FIELDS = [
	"location",
	"salary",
	"job_url",
	"source",
	"notes",
] as const;
const CORE_FIELDS = ["title", "company", "status", "applied_at"] as const;

export const Route = createFileRoute("/settings")({
	component: SettingsPage,
});

function SettingsPage() {
	const trpc = useTRPC();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const settingsQuery = useQuery(trpc.settings.getVisibleFields.queryOptions());
	const [selected, setSelected] = useState<string[]>([...ALL_OPTIONAL_FIELDS]);

	useEffect(() => {
		if (settingsQuery.data) {
			setSelected(
				settingsQuery.data.length === 0
					? [...ALL_OPTIONAL_FIELDS]
					: settingsQuery.data,
			);
		}
	}, [settingsQuery.data]);

	const saveMutation = useMutation(
		trpc.settings.setVisibleFields.mutationOptions({
			onSuccess: () => {
				void queryClient.invalidateQueries({
					queryKey: trpc.settings.getVisibleFields.queryKey(),
				});
				navigate({ to: "/" });
			},
		}),
	);

	const toggleField = (field: string) => {
		setSelected((prev) =>
			prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field],
		);
	};

	return (
		<div className="page-wrap py-8">
			<div className="flex items-center gap-3 mb-8">
				<Button
					variant="outline"
					size="icon"
					onClick={() => navigate({ to: "/" })}
					className="rounded-full"
				>
					<ArrowLeft className="size-4" />
				</Button>
				<h1 className="display-section">Customize Fields</h1>
			</div>

			<div className="panel rise-in">
				<p className="text-[var(--ink-60)] mb-6">
					Choose which optional fields appear in the add form and list table.
					Core fields are always visible.
				</p>

				<div className="space-y-6">
					<div>
						<h3 className="label-caps mb-3 text-[var(--ink-60)]">
							Core Fields (always on)
						</h3>
						<div className="space-y-2">
							{CORE_FIELDS.map((field) => (
								<label
									key={field}
									className="flex items-center gap-3 opacity-60 cursor-not-allowed"
								>
									<input type="checkbox" checked disabled className="size-4" />
									<span className="label-ui capitalize">
										{field.replace("_", " ")}
									</span>
								</label>
							))}
						</div>
					</div>

					<div>
						<h3 className="label-caps mb-3 text-[var(--ink-60)]">
							Optional Fields
						</h3>
						<div className="space-y-2">
							{ALL_OPTIONAL_FIELDS.map((field) => (
								<label
									key={field}
									className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
								>
									<input
										type="checkbox"
										checked={selected.includes(field)}
										onChange={() => toggleField(field)}
										className="size-4 accent-[var(--primary)]"
									/>
									<span className="label-ui capitalize">
										{field.replace("_", " ")}
									</span>
								</label>
							))}
						</div>
					</div>
				</div>

				<div className="mt-8 flex justify-end">
					<Button
						onClick={() => saveMutation.mutate({ fields: selected })}
						disabled={saveMutation.isPending}
						className="rounded-full px-6"
					>
						{saveMutation.isPending ? "Saving..." : "Save Settings"}
					</Button>
				</div>
			</div>
		</div>
	);
}
