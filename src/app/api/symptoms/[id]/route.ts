import { Symptom } from "@/modules/business-types";
import { DeleteSymptom$Params, GetSymptoms$Params, handler$DeleteSymptom, handler$GetSymptoms, handler$UpdateSymptom, UpdateSymptom$Params } from "@/modules/commands/CRUDSymptom/crud";
import { createRoute } from "@/modules/constructors/BaseRoute/route";

export const GET = createRoute<GetSymptoms$Params, (typeof Symptom)[]>({
  params: GetSymptoms$Params,
  handler: handler$GetSymptoms,
  success_message: "Symptom retrieved successfully",
  needAuth: true,
  useId: true,
});

export const PUT = createRoute<UpdateSymptom$Params, number>({
  params: UpdateSymptom$Params,
  handler: handler$UpdateSymptom,
  success_message: "Symptom updated successfully",
  needAuth: true,
  needAdmin: true,
  useId: true,
  omitResult: true,
});

export const DELETE = createRoute<DeleteSymptom$Params, number>({
  params: DeleteSymptom$Params,
  handler: handler$DeleteSymptom,
  success_message: "Symptom deleted successfully",
  needAuth: true,
  needAdmin: true,
  useId: true,
  omitResult: true,
});