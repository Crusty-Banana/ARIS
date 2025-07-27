import { Allergen, ObjectIdAsHexString } from "@/modules/business-types";
import { z } from "zod";

export const GetCrossAllergenFromUserID$Params = z.object({
    userID: ObjectIdAsHexString.optional(),
});

export type GetCrossAllergenFromUserID$Params = z.infer<typeof GetCrossAllergenFromUserID$Params>;

export const GetCrossAllergenFromUserID$Result = z.object({
    allergens: z.array(Allergen)
});

export type GetCrossAllergenFromUserID$Result = z.infer<typeof GetCrossAllergenFromUserID$Result>;