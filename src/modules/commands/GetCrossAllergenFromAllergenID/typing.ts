import { Allergen, ObjectIdAsHexString } from "@/modules/business-types";
import { z } from "zod";

export const GetCrossAllergenFromAllergenID$Params = z.object({
    allergenID: ObjectIdAsHexString.optional(),
});

export type GetCrossAllergenFromAllergenID$Params = z.infer<typeof GetCrossAllergenFromAllergenID$Params>;

export const GetCrossAllergenFromAllergenID$Result = z.object({
    allergens: z.array(Allergen)
});

export type GetCrossAllergenFromAllergenID$Result = z.infer<typeof GetCrossAllergenFromAllergenID$Result>;