import { ObjectIdAsHexString } from "@/modules/business-types";
import z from "zod";

export const UpdateAllergen$Params = z.object({
    id: ObjectIdAsHexString,
    name: z.string().optional(),
    symptomsId: z.array(z.string()).optional(),
    prevalence: z.number().min(1).max(5).optional(),
    description: z.string().optional(),
});
export type UpdateAllergen$Params = z.infer<typeof UpdateAllergen$Params>;

export const UpdateAllergenFetcher$Params = UpdateAllergen$Params.omit({ id: true })
export type UpdateAllergenFetcher$Params = z.infer<typeof UpdateAllergenFetcher$Params>;

export const UpdateAllergen$Result = z.object({
    success: z.boolean(),
    message: z.string(),
});
export type UpdateAllergen$Result = z.infer<typeof UpdateAllergen$Result>;