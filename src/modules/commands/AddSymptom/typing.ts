import { Symptom } from "@/modules/business-types";
import z from "zod";

export const AddSymptom$Params = Symptom.omit({ id: true });
export type AddSymptom$Params = z.infer<typeof AddSymptom$Params>;

export const AddSymptom$Result = z.object({
    success: z.boolean(),
    message: z.string(),
    insertedId: z.string().optional(),
})
export type AddSymptom$Result = z.infer<typeof AddSymptom$Result>;