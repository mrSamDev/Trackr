import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { ApplicationForm } from "#/components/ApplicationForm";
import { Button } from "#/components/ui/button";
import { useTRPC } from "#/integrations/trpc/react";

export const Route = createFileRoute("/new")({
	component: NewModal,
});

function NewModal() {
	const trpc = useTRPC();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const settingsQuery = useQuery(trpc.settings.getVisibleFields.queryOptions());
	const visibleFields =
		!settingsQuery.data || settingsQuery.data.length === 0
			? ["location", "salary", "job_url", "source", "notes"]
			: settingsQuery.data;

	const createMutation = useMutation(
		trpc.applications.create.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: trpc.applications.list.queryKey(),
				});
				navigate({ to: "/" });
			},
		}),
	);

	return (
		<div className="modal-backdrop">
			<div className="panel w-full max-w-lg relative rise-in">
				<button
					type="button"
					onClick={() => navigate({ to: "/" })}
					className="absolute right-4 top-4 p-1 rounded-full hover:bg-[var(--ink-08)] transition-colors"
					aria-label="Close"
				>
					<X className="size-5" />
				</button>

				<h2 className="display-sub mb-6">Add Job Application</h2>

				<ApplicationForm
					visibleFields={visibleFields}
					onSubmit={(data) => {
						createMutation.mutate({
							...data,
							location: data.location || null,
							salary: data.salary || null,
							job_url: data.job_url || null,
							source: data.source || null,
							notes: data.notes || null,
						});
					}}
					isPending={createMutation.isPending}
				/>

				<div className="mt-4">
					<Button
						variant="ghost"
						onClick={() => navigate({ to: "/" })}
						className="w-full"
					>
						Cancel
					</Button>
				</div>
			</div>
		</div>
	);
}
