import { ObjectIdAsHexString } from "@/modules/business-types";
import z from "zod";

export const UpdateAllergy$Params = z.object({
    id: ObjectIdAsHexString,
    name: z.string().optional(),
    allergensId: z.array(ObjectIdAsHexString).optional(),
});
export type UpdateAllergy$Params = z.infer<typeof UpdateAllergy$Params>;

export const UpdateAllergyFetcher$Params = UpdateAllergy$Params.omit({ id: true })
export type UpdateAllergyFetcher$Params = z.infer<typeof UpdateAllergyFetcher$Params>;

export const UpdateAllergy$Result = z.object({
    success: z.boolean(),
    message: z.string(),
});
export type UpdateAllergy$Result = z.infer<typeof UpdateAllergy$Result>;