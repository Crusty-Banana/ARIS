import { Symptom } from "@/modules/business-types";
import { createCRUD } from "@/modules/constructors/BaseCRUD/crud";
import { z } from "zod";

export const {
  DisplayBusinessType: DisplaySymptom,
  addParams: AddSymptom$Params,
  getParams: GetSymptoms$Params,
  updateParams: UpdateSymptom$Params,
  deleteParams: DeleteSymptom$Params,
  addResult: AddSymptom$Result,
  getResult: GetSymptoms$Result,
  updateResult: UpdateSymptom$Result,
  deleteResult: DeleteSymptom$Result,
  addHandler: handler$AddSymptom,
  getHandler: handler$GetSymptoms,
  updateHandler: handler$UpdateSymptom,
  deleteHandler: handler$DeleteSymptom,
  addFetcher: httpPost$AddSymptom,
  getFetcher: httpGet$GetSymptom,
  updateFetcher: httpPut$UpdateSymptom,
  deleteFetcher: httpDelete$DeleteSymptom,
} = createCRUD<typeof Symptom>(Symptom, "symptoms_en");

export type AddSymptom$Params = z.infer<typeof AddSymptom$Params>;
export type GetSymptoms$Params = z.infer<typeof GetSymptoms$Params>;
export type UpdateSymptom$Params = z.infer<typeof UpdateSymptom$Params>;
export type DeleteSymptom$Params = z.infer<typeof DeleteSymptom$Params>;
export type AddSymptom$Result = z.infer<typeof AddSymptom$Result>;
export type GetSymptoms$Result = z.infer<typeof GetSymptoms$Result>;
export type UpdateSymptom$Result = z.infer<typeof UpdateSymptom$Result>;
export type DeleteSymptom$Result = z.infer<typeof DeleteSymptom$Result>;