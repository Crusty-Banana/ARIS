import { FetcherResult } from "@/modules/business-types";
import { z } from "zod";

export const AddFileToS3$Params = z.object({
  file: z.instanceof(Buffer),
  fileName: z.string(),
  contentType: z.string(),
});
export type AddFileToS3$Params = z.infer<typeof AddFileToS3$Params>;

export const AddFileToS3$Result = FetcherResult.extend({
  result: z.string().optional(),
});
export type AddFileToS3$Result = z.infer<typeof AddFileToS3$Result>;
