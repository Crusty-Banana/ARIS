import { Allergen, Allergy, FetcherResult, ObjectIdAsHexString, PAP, Recommendation, Symptom, User } from "@/modules/business-types";
import { z } from "zod";

export const LocalizedAllergen = Allergen.omit({ name: true, description: true }).extend({
  name: z.string(),
  description: z.string(),
});
export type LocalizedAllergen = z.infer<typeof LocalizedAllergen>;

export const LocalizedAllergy = Allergy.omit({ name: true }).extend({
  name: z.string(),
});
export type LocalizedAllergy = z.infer<typeof LocalizedAllergy>;

export const LocalizedSymptom = Symptom.omit({ name: true, description: true }).extend({
  name: z.string(),
  description: z.string(),
});
export type LocalizedSymptom = z.infer<typeof LocalizedSymptom>;

export const GetBusinessType$Params = z.object({
  id: ObjectIdAsHexString.optional(),
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
  lang: z.coerce.string().optional(),
});
export type GetBusinessType$Params = z.infer<typeof GetBusinessType$Params>;

export const GetUsers$Result = FetcherResult.extend({
  result: z.array(User).optional()
});
export type GetUsers$Result = z.infer<typeof GetUsers$Result>;

export const GetAllergens$Result = FetcherResult.extend({
  result: z.array(Allergen).optional()
});
export type GetAllergens$Result = z.infer<typeof GetAllergens$Result>;

export const GetAllergies$Result = FetcherResult.extend({
  result: z.array(Allergy).optional()
});
export type GetAllergies$Result = z.infer<typeof GetAllergies$Result>;

export const GetPAPs$Result = FetcherResult.extend({
  result: z.array(PAP).optional()
});
export type GetPAPs$Result = z.infer<typeof GetPAPs$Result>;

export const GetSymptoms$Result = FetcherResult.extend({
  result: z.array(Symptom).optional()
});
export type GetSymptoms$Result = z.infer<typeof GetSymptoms$Result>;

export const GetRecommendations$Result = FetcherResult.extend({
  result: z.array(Recommendation).optional()
});
export type GetRecommendations$Result = z.infer<typeof GetRecommendations$Result>;



export const GetAllergensLocalized$Result = FetcherResult.extend({
  result: z.array(LocalizedAllergen).optional()
});
export type GetAllergensLocalized$Result = z.infer<typeof GetAllergensLocalized$Result>;

export const GetAllergiesLocalized$Result = FetcherResult.extend({
  result: z.array(LocalizedAllergy).optional()
});
export type GetAllergiesLocalized$Result = z.infer<typeof GetAllergiesLocalized$Result>;

export const GetSymptomsLocalized$Result = FetcherResult.extend({
  result: z.array(LocalizedSymptom).optional()
});
export type GetSymptomsLocalized$Result = z.infer<typeof GetSymptomsLocalized$Result>;