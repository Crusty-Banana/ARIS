import { DeleteRecommendation$Params, DisplayRecommendation, GetRecommendations$Params, handler$DeleteRecommendation, handler$GetRecommendations, handler$UpdateRecommendation, UpdateRecommendation$Params } from "@/modules/commands/CRUDRecommendation/crud";
import { createRoute } from "@/modules/constructors/BaseRoute/route";
import { z } from "zod";

export const GET = createRoute<GetRecommendations$Params, (z.infer<typeof DisplayRecommendation>)[]>({
  params: GetRecommendations$Params,
  handler: handler$GetRecommendations,
  success_message: "Recommendation retrieved successfully",
  needAuth: true,
  useId: true,
});

export const PUT = createRoute<UpdateRecommendation$Params, number>({
  params: UpdateRecommendation$Params,
  handler: handler$UpdateRecommendation,
  success_message: "Recommendation updated successfully",
  needAuth: true,
  needAdmin: true,
  useId: true,
  omitResult: true,
});

export const DELETE = createRoute<DeleteRecommendation$Params, number>({
  params: DeleteRecommendation$Params,
  handler: handler$DeleteRecommendation,
  success_message: "Recommendation deleted successfully",
  needAuth: true,
  needAdmin: true,
  useId: true,
  omitResult: true,
});