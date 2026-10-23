import { createCallerFactory, router } from "../trpc";

export const appRouter = router({});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
