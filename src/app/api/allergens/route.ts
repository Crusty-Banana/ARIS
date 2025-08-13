import { createRoute } from '@/modules/constructors/BaseRoute/route';
import { ObjectIdAsHexString } from '@/modules/business-types';
import { AddAllergen$Params, DisplayAllergen, GetAllergens$Params, handler$AddAllergen, handler$GetAllergens } from '@/modules/commands/CRUDAllergen/crud';
import { z } from 'zod';

export const POST = createRoute<AddAllergen$Params, ObjectIdAsHexString>({
  params: AddAllergen$Params,
  handler: handler$AddAllergen,
  success_message: "Allergen added successfully",
  needAuth: true,
  needAdmin: true,
});

export const GET = createRoute<GetAllergens$Params, (z.infer<typeof DisplayAllergen>)[]>({
  params: GetAllergens$Params,
  handler: handler$GetAllergens,
  success_message: "Allergens retrieved successfully",
  needAuth: true,
  needSearchParams: true,
});