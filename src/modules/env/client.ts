import { z } from "zod";

export const ClientEnv = z.object({});
export type ClientEnv = z.infer<typeof ClientEnv>;

export const CLIENT_ENV = ClientEnv.parse({});
