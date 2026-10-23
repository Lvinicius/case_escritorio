import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError, z } from "zod";
import { tarefaStore, type TarefaStore } from "./store";

export type Context = { store: TarefaStore };

export const createTRPCContext = async (): Promise<Context> => ({
  store: tarefaStore,
});

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        fieldErrors:
          error.cause instanceof ZodError
            ? z.flattenError(error.cause).fieldErrors
            : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
