import { Allergy } from "@/modules/business-types";
import { createCRUD } from "@/modules/constructors/BaseCRUD/crud";
import { z } from "zod";

export const {
  addParams: AddAllergy$Params,
  getParams: GetAllergies$Params,
  updateParams: UpdateAllergy$Params,
  deleteParams: DeleteAllergy$Params,
  addResult: AddAllergy$Result,
  getResult: GetAllergies$Result,
  updateResult: UpdateAllergy$Result,
  deleteResult: DeleteAllergy$Result,
  addHandler: handler$AddAllergy,
  getHandler: handler$GetAllergies,
  updateHandler: handler$UpdateAllergy,
  deleteHandler: handler$DeleteAllergy,
  addFetcher: httpPost$AddAllergy,
  getFetcher: httpGet$GetAllergies,
  updateFetcher: httpPut$UpdateAllergy,
  deleteFetcher: httpDelete$DeleteAllergy,
} = createCRUD<typeof Allergy>(Allergy, "allergies_en");

export type AddAllergy$Params = z.infer<typeof AddAllergy$Params>;
export type GetAllergies$Params = z.infer<typeof GetAllergies$Params>;
export type UpdateAllergy$Params = z.infer<typeof UpdateAllergy$Params>;
export type DeleteAllergy$Params = z.infer<typeof DeleteAllergy$Params>;
export type AddAllergy$Result = z.infer<typeof AddAllergy$Result>;
export type GetAllergies$Result = z.infer<typeof GetAllergies$Result>;
export type UpdateAllergy$Result = z.infer<typeof UpdateAllergy$Result>;
export type DeleteAllergy$Result = z.infer<typeof DeleteAllergy$Result>;