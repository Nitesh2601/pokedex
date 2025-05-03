// src/server/trpc/trpc.ts

import { initTRPC } from '@trpc/server';
import type { inferAsyncReturnType } from '@trpc/server';
import { prisma } from '@/utils/prisma';

export const createContext = () => ({
  prisma,
});

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
