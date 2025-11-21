import { FetcherResult, Symptom } from "@/modules/business-types";
import z from "zod";

export const GetDetailSymptom$Params = z.object({
  id: z.string(),
});
export type GetDetailSymptom$Params = z.infer<typeof GetDetailSymptom$Params>;

export const GetDetailSymptom$Result = FetcherResult.extend({
  result: Symptom.optional(),
});
export type GetDetailSymptom$Result = z.infer<typeof GetDetailSymptom$Result>;
