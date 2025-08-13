import { ObjectIdAsHexString } from "@/modules/business-types";
import { AddSymptom$Params, DisplaySymptom, GetSymptoms$Params, handler$AddSymptom, handler$GetSymptoms } from "@/modules/commands/CRUDSymptom/crud";
import { createRoute } from "@/modules/constructors/BaseRoute/route";
import { z } from "zod";

export const POST = createRoute<AddSymptom$Params, ObjectIdAsHexString>({
  params: AddSymptom$Params,
  handler: handler$AddSymptom,
  success_message: "Symptom added successfully",
  needAuth: true,
  needAdmin: true,
});

export const GET = createRoute<GetSymptoms$Params, (z.infer<typeof DisplaySymptom>)[]>({
  params: GetSymptoms$Params,
  handler: handler$GetSymptoms,
  success_message: "Symptoms retrieved successfully",
  needAuth: true,
  useId: true,
});