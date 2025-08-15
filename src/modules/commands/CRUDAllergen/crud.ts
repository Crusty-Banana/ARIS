import { Allergen } from "@/modules/business-types";
import { createCRUD } from "@/modules/constructors/BaseCRUD/crud";
import { z } from "zod";

export const {
  DisplayBusinessType: DisplayAllergen,
  addParams: AddAllergen$Params,
  getParams: GetAllergens$Params,
  updateParams: UpdateAllergen$Params,
  deleteParams: DeleteAllergen$Params,
  addResult: AddAllergen$Result,
  getResult: GetAllergens$Result,
  updateResult: UpdateAllergen$Result,
  deleteResult: DeleteAllergen$Result,
  addHandler: handler$AddAllergen,
  getHandler: handler$GetAllergens,
  updateHandler: handler$UpdateAllergen,
  deleteHandler: handler$DeleteAllergen,
  addFetcher: httpPost$AddAllergen,
  getFetcher: httpGet$GetAllergens,
  updateFetcher: httpPut$UpdateAllergen,
  deleteFetcher: httpDelete$DeleteAllergen,
} = createCRUD<typeof Allergen>(Allergen, "allergens_en");

export type AddAllergen$Params = z.infer<typeof AddAllergen$Params>;
export type GetAllergens$Params = z.infer<typeof GetAllergens$Params>;
export type UpdateAllergen$Params = z.infer<typeof UpdateAllergen$Params>;
export type DeleteAllergen$Params = z.infer<typeof DeleteAllergen$Params>;
export type AddAllergen$Result = z.infer<typeof AddAllergen$Result>;
export type GetAllergens$Result = z.infer<typeof GetAllergens$Result>;
export type UpdateAllergen$Result = z.infer<typeof UpdateAllergen$Result>;
export type DeleteAllergen$Result = z.infer<typeof DeleteAllergen$Result>;