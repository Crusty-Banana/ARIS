import { Allergen, FetcherResult, Language } from "@/modules/business-types";
import z, { string } from "zod";

export const RemainAllergen = Allergen.pick({
  id: true,
}).extend({
  type: z.string(),
  name: z.string(),
  description: z.string(),
});
export type RemainAllergen = z.infer<typeof RemainAllergen>;

export const GetRemainAllergens$Params = z.object({
  userId: z.string(),
  name: z.string().optional(),
  lang: Language.default("en"),
});
export type GetRemainAllergens$Params = z.infer<
  typeof GetRemainAllergens$Params
>;

export const GetRemainAllergens$Result = FetcherResult.extend({
  result: z.array(RemainAllergen).optional(),
});
export type GetRemainAllergens$Result = z.infer<
  typeof GetRemainAllergens$Result
>;

export const GetRemainAllergensFetcher$Params = GetRemainAllergens$Params.omit({
  userId: true,
});
export type GetRemainAllergensFetcher$Params = z.infer<
  typeof GetRemainAllergensFetcher$Params
>;
