import { ObjectIdAsHexString } from "@/modules/business-types";
import z from "zod";

export const UpdateSymptom$Params = z.object({
    id: ObjectIdAsHexString,
    name: z.string().min(1, "Symptom name is required").optional(),
    severity: z.number().min(1).max(3).optional(),
    prevalence: z.number().min(1).max(5).default(1).optional(),
    treatment: z.string().default("").optional(),
});
export type UpdateSymptom$Params = z.infer<typeof UpdateSymptom$Params>;

export const UpdateSymptomFetcher$Params = UpdateSymptom$Params.omit({ id: true })
export type UpdateSymptomFetcher$Params = z.infer<typeof UpdateSymptomFetcher$Params>;

export const UpdateSymptom$Result = z.object({
    success: z.boolean(),
    message: z.string(),
});
export type UpdateSymptom$Result = z.infer<typeof UpdateSymptom$Result>;