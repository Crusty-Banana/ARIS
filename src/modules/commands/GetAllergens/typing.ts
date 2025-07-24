import { Allergen, ObjectIdAsHexString } from "@/modules/business-types";
import { z } from "zod";

export const GetAllergens$Params = z.object({
    id: ObjectIdAsHexString.optional(),
    limit: z.coerce.number().optional(),
    offset: z.coerce.number().optional()
});

export type GetAllergens$Params = z.infer<typeof GetAllergens$Params>;

export const GetAllergens$Result = z.object({
    allergens: z.array(Allergen)
});

export type GetAllergens$Result = z.infer<typeof GetAllergens$Result>;