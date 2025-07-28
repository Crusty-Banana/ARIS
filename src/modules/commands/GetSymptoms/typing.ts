import { Symptom, ObjectIdAsHexString } from "@/modules/business-types";
import { z } from "zod";

export const GetSymptoms$Params = z.object({
    id: ObjectIdAsHexString.optional(),
    limit: z.coerce.number().optional(),
    offset: z.coerce.number().optional()
});

export type GetSymptoms$Params = z.infer<typeof GetSymptoms$Params>;

export const GetSymptoms$Result = z.object({
    success: z.boolean(),
    message: z.string(),
    symptoms: z.array(Symptom).optional(),
});

export type GetSymptoms$Result = z.infer<typeof GetSymptoms$Result>;