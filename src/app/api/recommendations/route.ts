import { ObjectIdAsHexString, Recommendation } from "@/modules/business-types";
import { AddRecommendation$Params, GetRecommendations$Params, handler$AddRecommendation, handler$GetRecommendations } from "@/modules/commands/CRUDRecommendation/crud";
import { createRoute } from "@/modules/constructors/BaseRoute/route";

export const POST = createRoute<AddRecommendation$Params, ObjectIdAsHexString>({
  params: AddRecommendation$Params,
  handler: handler$AddRecommendation,
  success_message: "Recommendation added successfully",
  needAuth: true,
  needAdmin: true,
});

export const GET = createRoute<GetRecommendations$Params, (typeof Recommendation)[]>({
  params: GetRecommendations$Params,
  handler: handler$GetRecommendations,
  success_message: "Recommendations retrieved successfully",
  needAuth: true,
  needSearchParams: true,
});