import { Recommendation } from "@/modules/business-types";
import { createCRUD } from "@/modules/constructors/BaseCRUD/crud";
import { z } from "zod";

export const {
  DisplayBusinessType: DisplayRecommendation,
  addParams: AddRecommendation$Params,
  getParams: GetRecommendations$Params,
  updateParams: UpdateRecommendation$Params,
  deleteParams: DeleteRecommendation$Params,
  addResult: AddRecommendation$Result,
  getResult: GetRecommendations$Result,
  updateResult: UpdateRecommendation$Result,
  deleteResult: DeleteRecommendation$Result,
  addHandler: handler$AddRecommendation,
  getHandler: handler$GetRecommendations,
  updateHandler: handler$UpdateRecommendation,
  deleteHandler: handler$DeleteRecommendation,
  addFetcher: httpPost$AddRecommendation,
  getFetcher: httpGet$GetRecommendation,
  updateFetcher: httpPut$UpdateRecommendation,
  deleteFetcher: httpDelete$DeleteRecommendation,
} = createCRUD<typeof Recommendation>(Recommendation, "recommendations");

export type AddRecommendation$Params = z.infer<typeof AddRecommendation$Params>;
export type GetRecommendations$Params = z.infer<typeof GetRecommendations$Params>;
export type UpdateRecommendation$Params = z.infer<typeof UpdateRecommendation$Params>;
export type DeleteRecommendation$Params = z.infer<typeof DeleteRecommendation$Params>;
export type AddRecommendation$Result = z.infer<typeof AddRecommendation$Result>;
export type GetRecommendations$Result = z.infer<typeof GetRecommendations$Result>;
export type UpdateRecommendation$Result = z.infer<typeof UpdateRecommendation$Result>;
export type DeleteRecommendation$Result = z.infer<typeof DeleteRecommendation$Result>;