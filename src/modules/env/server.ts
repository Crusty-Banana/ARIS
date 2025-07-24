import { z } from "zod";
import { CLIENT_ENV, ClientEnv } from "./client";

export const ServerEnv = ClientEnv.extend({
    MONGODB_URI: z.string().startsWith("mongodb"),
    MONGODB_DBNAME: z.string(),
    NEXTAUTH_URL: z.string(),
    NEXTAUTH_SECRET: z.string(),
});

export type ServerEnv = z.infer<typeof ServerEnv>;

export const SERVER_ENV = ServerEnv.parse({
    ...CLIENT_ENV,
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DBNAME: process.env.MONGODB_DBNAME,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
});
