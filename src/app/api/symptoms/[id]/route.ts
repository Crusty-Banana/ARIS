import { DeleteSymptom$Params, DisplaySymptom, GetSymptoms$Params, handler$DeleteSymptom, handler$GetSymptoms, handler$UpdateSymptom, UpdateSymptom$Params } from "@/modules/commands/CRUDSymptom/crud";
import { createRoute } from "@/modules/constructors/BaseRoute/route";
import { z } from "zod";

export const GET = createRoute<GetSymptoms$Params, (z.infer<typeof DisplaySymptom>)[]>({
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