import { createRoute } from "@/modules/constructors/BaseRoute/route";
import { Allergy, ObjectIdAsHexString } from "@/modules/business-types";
import { AddAllergy$Params, GetAllergies$Params, handler$AddAllergy, handler$GetAllergies } from "@/modules/commands/CRUDAllergy/crud";

export const POST = createRoute<AddAllergy$Params, ObjectIdAsHexString>({
  params: AddAllergy$Params,
  handler: handler$AddAllergy,
  success_message: "Allergy added successfully",
  needAuth: true,
  needAdmin: true,
})

export const GET = createRoute<GetAllergies$Params, (typeof Allergy)[]>({
  params: GetAllergies$Params,
  handler: handler$GetAllergies,
  success_message: "Allergies retrieved successfully",
  needAuth: true,
  needSearchParams: true,
})