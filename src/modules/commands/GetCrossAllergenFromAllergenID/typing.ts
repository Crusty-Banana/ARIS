import { Allergen, FetcherResult, ObjectIdAsHexString } from "@/modules/business-types";
import { z } from "zod";

export const GetCrossAllergenFromAllergenID$Params = z.object({
    allergenID: ObjectIdAsHexString,
});

export type GetCrossAllergenFromAllergenID$Params = z.infer<typeof GetCrossAllergenFromAllergenID$Params>;

export const GetCrossAllergenFromAllergenID$Result = FetcherResult.extend({
    result: z.array(Allergen).optional()
});

export type GetCrossAllergenFromAllergenID$Result = z.infer<typeof GetCrossAllergenFromAllergenID$Result>;