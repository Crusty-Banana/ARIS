import { z } from "zod";
import { CLIENT_ENV, ClientEnv } from "./client";

export const ServerEnv = ClientEnv.extend({
    MONGODB_URI: z.string().startsWith("mongodb"),
    MONGODB_DBNAME: z.string(),
    NEXTAUTH_SECRET: z.string(),
    AWS_REGION: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_S3_BUCKET_NAME: z.string(),
});

export type ServerEnv = z.infer<typeof ServerEnv>;

export const SERVER_ENV = ServerEnv.parse({
    ...CLIENT_ENV,
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DBNAME: process.env.MONGODB_DBNAME,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
});
