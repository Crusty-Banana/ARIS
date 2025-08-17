import { Allergen, FetcherResult, ObjectIdAsHexString } from "@/modules/business-types";
import { z } from "zod";

export const GetCrossAllergenFromUserID$Params = z.object({
    userID: ObjectIdAsHexString,
});

export type GetCrossAllergenFromUserID$Params = z.infer<typeof GetCrossAllergenFromUserID$Params>;

export const GetCrossAllergenFromUserID$Result = FetcherResult.extend({
    result: z.array(Allergen).optional()
});

export type GetCrossAllergenFromUserID$Result = z.infer<typeof GetCrossAllergenFromUserID$Result>;