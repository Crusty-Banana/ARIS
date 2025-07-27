import { Allergy, ObjectIdAsHexString } from "@/modules/business-types";
import z from "zod";

export const AddAllergy$Params = Allergy.omit({ id: true })
export type AddAllergy$Params = z.infer<typeof AddAllergy$Params>

export const AddAllergy$Result = z.object({
    success: z.boolean(),
    message: z.string(),
    allergyId: ObjectIdAsHexString,
})
export type AddAllergy$Result = z.infer<typeof AddAllergy$Result>