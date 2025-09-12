import { Allergen, PAP, Recommendation, Symptom, User } from "@/modules/business-types";
import { z } from "zod";

export const UpdateUser$Params = User.partial().required({ id: true });
export type UpdateUser$Params = z.infer<typeof UpdateUser$Params>;

export const UpdateAllergen$Params = Allergen.partial().required({ id: true });
export type UpdateAllergen$Params = z.infer<typeof UpdateAllergen$Params>;

export const UpdatePAP$Params = PAP.partial().required({ id: true });
export type UpdatePAP$Params = z.infer<typeof UpdatePAP$Params>;

export const UpdateSymptom$Params = Symptom.partial().required({ id: true });
export type UpdateSymptom$Params = z.infer<typeof UpdateSymptom$Params>;

export const UpdateRecommendation$Params = Recommendation.partial().required({ id: true });
export type UpdateRecommendation$Params = z.infer<typeof UpdateRecommendation$Params>;



export const UpdateUserFetcher$Params = UpdateUser$Params.omit({ id: true });
export type UpdateUserFetcher$Params = z.infer<typeof UpdateUserFetcher$Params>;

export const UpdateAllergenFetcher$Params = UpdateAllergen$Params.omit({ id: true });
export type UpdateAllergenFetcher$Params = z.infer<typeof UpdateAllergenFetcher$Params>;

export const UpdatePAPFetcher$Params = UpdatePAP$Params.omit({ id: true });
export type UpdatePAPFetcher$Params = z.infer<typeof UpdatePAPFetcher$Params>;

export const UpdateSymptomFetcher$Params = UpdateSymptom$Params.omit({ id: true });
export type UpdateSymptomFetcher$Params = z.infer<typeof UpdateSymptomFetcher$Params>;

export const UpdateRecommendationFetcher$Params = UpdateRecommendation$Params.omit({ id: true });
export type UpdateRecommendationFetcher$Params = z.infer<typeof UpdateRecommendationFetcher$Params>;