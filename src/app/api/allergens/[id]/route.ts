import { createRoute } from "@/modules/constructors/BaseRoute/route";
import { handler$DeleteAllergen, DeleteAllergen$Params, UpdateAllergen$Params, handler$UpdateAllergen, GetAllergens$Params, handler$GetAllergens, DisplayAllergen } from "@/modules/commands/CRUDAllergen/crud"
import { z } from "zod";

export const GET = createRoute<GetAllergens$Params, (z.infer<typeof DisplayAllergen>)[]>({
  params: GetAllergens$Params,
  handler: handler$GetAllergens,
  success_message: "Allergen retrieved successfully",
  needAuth: true,
  useId: true,
})

export const PUT = createRoute<UpdateAllergen$Params, number>({
  params: UpdateAllergen$Params,
  handler: handler$UpdateAllergen,
  success_message: "Allergen updated successfully",
  needAuth: true,
  needAdmin: true,
  useId: true,
  omitResult: true,
})

export const DELETE = createRoute<DeleteAllergen$Params, number>({
  params: DeleteAllergen$Params,
  handler: handler$DeleteAllergen,
  success_message: "Allergen deleted successfully",
  needAuth: true,
  needAdmin: true,
  useId: true,
  omitResult: true,
})

