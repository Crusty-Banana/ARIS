import {
  Allergen,
  AllergenType,
  FetcherResult,
  Language,
} from "@/modules/business-types";
import z from "zod";

export const BaseBriefAllergen = Allergen.pick({
  id: true,
  type: true,
});

export const BriefAllergen = BaseBriefAllergen.extend({
  name: z.string(),
});
export type BriefAllergen = z.infer<typeof BriefAllergen>;

export const GetBriefAllergens$Params = z.object({
  ids: z.array(z.string()).optional(),
  name: z.string().optional(),
  type: AllergenType.optional(),
  sort: z.enum(["asc", "desc"]).default("asc").optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  lang: Language.default("en"),
});
export type GetBriefAllergens$Params = z.infer<typeof GetBriefAllergens$Params>;

export const GetBriefAllergens$Result = FetcherResult.extend({
  result: z.array(BriefAllergen).optional(),
  total: z.coerce.number().optional(),
});
export type GetBriefAllergens$Result = z.infer<typeof GetBriefAllergens$Result>;
