import { Allergen, FetcherResult, ObjectIdAsHexString, PAP, Recommendation, Symptom, User } from "@/modules/business-types";
import { z } from "zod";

// Conveniently Defined Types

export const LocalizedAllergen = Allergen.omit({ name: true, description: true }).extend({
  name: z.string(),
  description: z.string(),
});
export type LocalizedAllergen = z.infer<typeof LocalizedAllergen>;

export const LocalizedSymptom = Symptom.omit({ name: true, description: true }).extend({
  name: z.string(),
  description: z.string(),
});
export type LocalizedSymptom = z.infer<typeof LocalizedSymptom>;

export const GetFilter = z.object({
  isWholeAllergen: z.boolean().optional(),
  _id: z.object({
    $nin: z.array(ObjectIdAsHexString).optional(),
  }).optional(),
});
export type GetFilter = z.infer<typeof GetFilter>;

// Handler Parameters

export const GetBusinessType$Params = z.object({
  ids: z.array(ObjectIdAsHexString).optional(),
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
  lang: z.string().optional(),
  filters: GetFilter.optional(),
})
export type GetBusinessType$Params = z.infer<typeof GetBusinessType$Params>;

export const GetUsers$Params = GetBusinessType$Params.omit({ filters: true });
export type GetUsers$Params = z.infer<typeof GetUsers$Params>;

export const GetAllergens$Params = GetBusinessType$Params.omit({ filters: true }).extend(
  { filters: GetFilter.pick({ isWholeAllergen: true, _id: true }).optional() }
)
export type GetAllergens$Params = z.infer<typeof GetAllergens$Params>;

export const GetPAP$Params = GetBusinessType$Params.omit({ filters: true });
export type GetPAP$Params = z.infer<typeof GetPAP$Params>;

export const GetSymptoms$Params = GetBusinessType$Params.omit({ filters: true });
export type GetSymptoms$Params = z.infer<typeof GetSymptoms$Params>;

export const GetRecommendations$Params = GetBusinessType$Params.omit({ filters: true });
export type GetRecommendations$Params = z.infer<typeof GetRecommendations$Params>;

// Fetcher Results

export const GetUsers$Result = FetcherResult.extend({
  result: z.array(User).optional()
});
export type GetUsers$Result = z.infer<typeof GetUsers$Result>;

export const GetAllergens$Result = FetcherResult.extend({
  result: z.array(Allergen).optional()
});
export type GetAllergens$Result = z.infer<typeof GetAllergens$Result>;

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

// Fetcher Localized Result

export const GetAllergensLocalized$Result = FetcherResult.extend({
  result: z.array(LocalizedAllergen).optional()
});
export type GetAllergensLocalized$Result = z.infer<typeof GetAllergensLocalized$Result>;

export const GetSymptomsLocalized$Result = FetcherResult.extend({
  result: z.array(LocalizedSymptom).optional()
});
export type GetSymptomsLocalized$Result = z.infer<typeof GetSymptomsLocalized$Result>;