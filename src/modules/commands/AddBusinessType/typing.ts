import { Allergen, FetcherResult, ObjectIdAsHexString, PAP, Recommendation, Symptom, User } from "@/modules/business-types";
import { z } from "zod";

export const AddUser$Params = User.omit({ id: true });
export type AddUser$Params = z.infer<typeof AddUser$Params>;

export const AddAllergen$Params = Allergen.omit({ id: true });
export type AddAllergen$Params = z.infer<typeof AddAllergen$Params>;

export const AddPAP$Params = PAP.omit({ id: true });
export type AddPAP$Params = z.infer<typeof AddPAP$Params>;

export const AddSymptom$Params = Symptom.omit({ id: true });
export type AddSymptom$Params = z.infer<typeof AddSymptom$Params>;

export const AddRecommendation$Params = Recommendation.omit({ id: true });
export type AddRecommendation$Params = z.infer<typeof AddRecommendation$Params>;

export const AddBusinessType$Result = FetcherResult.extend({
  result: ObjectIdAsHexString.optional(),
});
export type AddBusinessType$Result = z.infer<typeof AddBusinessType$Result>;