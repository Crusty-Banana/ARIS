import { ObjectIdAsHexString } from "@/modules/business-types";
import z from "zod";

export const DeleteAllergen$Params = z.object({
    id: ObjectIdAsHexString
});

export type DeleteAllergen$Params = z.infer<typeof DeleteAllergen$Params>;

export const DeleteAllergen$Result = z.object({
    message: z.string(),
});

export type DeleteAllergen$Result = z.infer<typeof DeleteAllergen$Result>;