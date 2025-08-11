import { Recommendation } from "@/modules/business-types";
import { z } from "zod";

export const AddRecommendation$Params = Recommendation.omit({ id: true });
export type AddRecommendation$Params = z.infer<typeof AddRecommendation$Params>;

export const AddRecommendation$Result = z.object(
    {
        success: z.boolean(),
        message: z.string(),
        recommendationId: z.string().optional(),
    }
);
export type AddRecommendation$Result = z.infer<typeof AddRecommendation$Result>;