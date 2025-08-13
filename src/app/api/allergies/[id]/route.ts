import { createRoute } from "@/modules/constructors/BaseRoute/route";
import { Allergy } from "@/modules/business-types";
import { DeleteAllergy$Params, GetAllergies$Params, handler$DeleteAllergy, handler$GetAllergies, handler$UpdateAllergy, UpdateAllergy$Params } from "@/modules/commands/CRUDAllergy/crud";

export const GET = createRoute<GetAllergies$Params, (typeof Allergy)[]>({
  params: GetAllergies$Params,
  handler: handler$GetAllergies,
  success_message: "Allergy retrieved successfully",
  needAuth: true,
  useId: true,
})

export const PUT = createRoute<UpdateAllergy$Params, number>({
  params: UpdateAllergy$Params,
  handler: handler$UpdateAllergy,
  success_message: "Allergy updated successfully",
  needAuth: true,
  needAdmin: true,
  useId: true,
  omitResult: true,
})

export const DELETE = createRoute<DeleteAllergy$Params, number>({
  params: DeleteAllergy$Params,
  handler: handler$DeleteAllergy,
  success_message: "Allergy deleted successfully",
  needAuth: true,
  needAdmin: true,
  useId: true,
  omitResult: true,
})

