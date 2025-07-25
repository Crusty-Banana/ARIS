import { Allergy, ObjectIdAsHexString } from "@/modules/business-types";
import z from "zod";

export const GetAllergies$Params = z.object({
    id: ObjectIdAsHexString.optional(),
    limit: z.coerce.number().optional(),
    offset: z.coerce.number().optional()
});
export type GetAllergies$Params = z.infer<typeof GetAllergies$Params>;

export const GetAllergies$Result = z.object({
    allergies: z.array(Allergy).optional(),
    message: z.string().optional()
});
export type GetAllergies$Result = z.infer<typeof GetAllergies$Result>;