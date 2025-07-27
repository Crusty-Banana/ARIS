import { ObjectIdAsHexString } from "@/modules/business-types";
import z from "zod";

export const UpdateAllergen$Params = z.object({
    id: ObjectIdAsHexString,
    name: z.string().optional(),
    symptoms: z.array(z.string()).optional(),
    treatment: z.string().optional(),
    firstAid: z.string().optional(),
});
export type UpdateAllergen$Params = z.infer<typeof UpdateAllergen$Params>;

export const UpdateAllergenFetcher$Params = UpdateAllergen$Params.omit({ id: true })
export type UpdateAllergenFetcher$Params = z.infer<typeof UpdateAllergenFetcher$Params>;

export const UpdateAllergen$Result = z.object({
    success: z.boolean(),
    message: z.string(),
});
export type UpdateAllergen$Result = z.infer<typeof UpdateAllergen$Result>;