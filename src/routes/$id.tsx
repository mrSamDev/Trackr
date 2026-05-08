import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { ApplicationForm } from "#/components/ApplicationForm";
import { Button } from "#/components/ui/button";
import { useTRPC } from "#/integrations/trpc/react";

export const Route = createFileRoute("/$id")({
	component: EditModal,
});

function EditModal() {
	const { id: idParam } = Route.useParams();
	const id = Number(idParam);
	const trpc = useTRPC();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const appQuery = useQuery(
		trpc.applications.get.queryOptions(
			{ id },
			{ enabled: !Number.isNaN(id) && id > 0 },
		),
	);

	const settingsQuery = useQuery(trpc.settings.getVisibleFields.queryOptions());
	const visibleFields =
		!settingsQuery.data || settingsQuery.data.length === 0
			? ["location", "salary", "job_url", "source", "notes"]
			: settingsQuery.data;

	const updateMutation = useMutation(
		trpc.applications.update.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: trpc.applications.list.queryKey(),
				});
				queryClient.invalidateQueries({
					queryKey: trpc.applications.get.queryKey(),
				});
				navigate({ to: "/" });
			},
		}),
	);

	const deleteMutation = useMutation(
		trpc.applications.delete.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: trpc.applications.list.queryKey(),
				});
				navigate({ to: "/" });
			},
		}),
	);

	if (!id || Number.isNaN(id)) {
		return (
			<div className="modal-backdrop">
				<div className="panel w-full max-w-lg text-center">
					<h2 className="display-sub mb-4">Invalid Application ID</h2>
					<Button onClick={() => navigate({ to: "/" })}>Go Back</Button>
				</div>
			</div>
		);
	}

	if (appQuery.isLoading) {
		return (
			<div className="modal-backdrop">
				<div className="panel w-full max-w-lg text-center">
					<h2 className="display-sub">Loading...</h2>
				</div>
			</div>
		);
	}

	if (!appQuery.data) {
		return (
			<div className="modal-backdrop">
				<div className="panel w-full max-w-lg text-center">
					<h2 className="display-sub mb-4">Application Not Found</h2>
					<Button onClick={() => navigate({ to: "/" })}>Go Back</Button>
				</div>
			</div>
		);
	}

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

				<h2 className="display-sub mb-6">Edit Application</h2>

				<ApplicationForm
					initialData={appQuery.data}
					visibleFields={visibleFields}
					onSubmit={(data) => {
						updateMutation.mutate({
							id,
							data: {
								...data,
								location: data.location || null,
								salary: data.salary || null,
								job_url: data.job_url || null,
								source: data.source || null,
								notes: data.notes || null,
							},
						});
					}}
					onDelete={() => {
						if (
							window.confirm(
								"Are you sure you want to delete this application?",
							)
						) {
							deleteMutation.mutate({ id });
						}
					}}
					isPending={updateMutation.isPending || deleteMutation.isPending}
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
