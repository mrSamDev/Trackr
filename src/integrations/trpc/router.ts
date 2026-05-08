import { applicationsRouter } from "./applications";
import { createTRPCRouter } from "./init";
import { settingsRouter } from "./settings";

const appRouter = createTRPCRouter({
	applications: applicationsRouter,
	settings: settingsRouter,
});

export type TRPCRouter = typeof appRouter;

export { appRouter };
