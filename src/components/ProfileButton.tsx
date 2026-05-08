import { useNavigate } from "@tanstack/react-router";
import { User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "#/lib/auth-client";

export function ProfileButton() {
	const { data: session } = useSession();
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		function handleOutsideClick(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, [open]);

	const user = session?.user;
	const initial = user?.name?.[0]?.toUpperCase();

	async function handleSignOut() {
		await signOut({
			fetchOptions: {
				onSuccess: () => navigate({ to: "/login" }),
			},
		});
	}

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="size-9 rounded-full border-[3px] border-[var(--ink)] bg-[var(--panel)] flex items-center justify-center hover:bg-[var(--ink-08)] transition-colors"
				aria-label="Profile"
			>
				{initial ? (
					<span className="label-caps text-xs">{initial}</span>
				) : (
					<User className="size-4" />
				)}
			</button>

			{open && (
				<div className="absolute right-0 top-11 z-50 bg-[var(--panel)] border-[3px] border-[var(--ink)] rounded-[24px] shadow-md p-3 min-w-[200px]">
					{user && (
						<div className="px-3 py-2 mb-1">
							{user.name && (
								<p className="text-sm font-800 text-[var(--ink)] truncate">
									{user.name}
								</p>
							)}
							{user.email && (
								<p className="text-xs text-[var(--ink-60)] truncate">{user.email}</p>
							)}
						</div>
					)}
					<hr className="border-[var(--ink-14)] border-t-2 mx-1 mb-1" />
					<button
						type="button"
						onClick={handleSignOut}
						className="w-full text-left text-sm font-700 text-destructive hover:bg-[var(--ink-08)] rounded-xl px-3 py-2 transition-colors"
					>
						Sign out
					</button>
				</div>
			)}
		</div>
	);
}
