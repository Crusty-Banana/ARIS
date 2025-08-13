import { ObjectIdAsHexString, Symptom } from "@/modules/business-types";
import { AddSymptom$Params, GetSymptoms$Params, handler$AddSymptom, handler$GetSymptoms } from "@/modules/commands/CRUDSymptom/crud";
import { createRoute } from "@/modules/constructors/BaseRoute/route";

export const POST = createRoute<AddSymptom$Params, ObjectIdAsHexString>({
  params: AddSymptom$Params,
  handler: handler$AddSymptom,
  success_message: "Symptom added successfully",
  needAuth: true,
  needAdmin: true,
});

export const GET = createRoute<GetSymptoms$Params, (typeof Symptom)[]>({
  params: GetSymptoms$Params,
  handler: handler$GetSymptoms,
  success_message: "Symptoms retrieved successfully",
  needAuth: true,
  useId: true,
});