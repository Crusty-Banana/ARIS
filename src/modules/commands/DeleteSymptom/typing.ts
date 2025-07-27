import { ObjectIdAsHexString } from "@/modules/business-types";
import z from "zod";

export const DeleteSymptom$Params = z.object({
    id: ObjectIdAsHexString
});

export type DeleteSymptom$Params = z.infer<typeof DeleteSymptom$Params>;

export const DeleteSymptom$Result = z.object({
    success: z.boolean(),
    message: z.string(),
});

export type DeleteSymptom$Result = z.infer<typeof DeleteSymptom$Result>;