import { createFileRoute } from "@tanstack/react-router";
import { getSession } from "#/lib/auth.functions";
import { Dashboard } from "#/components/Dashboard";
import { LandingPage } from "#/components/LandingPage";

export const Route = createFileRoute("/")({
  loader: async () => {
    const session = await getSession();
    return { session };
  },
  component: Home,
  ssr: true,
});

function Home() {
  const { session } = Route.useLoaderData();
  if (session) return <Dashboard />;
  return <LandingPage />;
}
