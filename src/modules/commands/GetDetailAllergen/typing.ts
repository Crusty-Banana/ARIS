import { Allergen, FetcherResult, Language } from "@/modules/business-types";
import z from "zod";

export const DetailAllergen = Allergen.pick({
  id: true,
  type: true,
  name: true,
  description: true,
}).extend({
  crossSensitivities: z.array(
    Allergen.pick({
      id: true,
      name: true,
    })
  ),
});
export type DetailAllergen = z.infer<typeof DetailAllergen>;

export const GetDetailAllergen$Params = z.object({
  id: z.string(),
});
export type GetDetailAllergen$Params = z.infer<typeof GetDetailAllergen$Params>;

export const GetDetailAllergen$Result = FetcherResult.extend({
  result: DetailAllergen.optional(),
});
export type GetDetailAllergen$Result = z.infer<typeof GetDetailAllergen$Result>;
