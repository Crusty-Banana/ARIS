import {
  Symptom,
  Organ,
  Language,
  FetcherResult,
} from "@/modules/business-types";
import z from "zod";

const BaseBriefSymptom = Symptom.pick({
  id: true,
  severity: true,
});

export const BriefSymptom = BaseBriefSymptom.extend({
  name: z.string(),
});

export type BriefSymptom = z.infer<typeof BriefSymptom>;

export const GetBriefSymptoms$Params = z.object({
  ids: z.array(z.string()).optional(),
  name: z.string().optional(),
  organ: Organ.optional(),
  sort: z.enum(["asc", "desc"]).default("asc").optional(),
  sortBy: z.enum(["name", "severity"]).default("name").optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  lang: Language.default("en"),
});
export type GetBriefSymptoms$Params = z.infer<typeof GetBriefSymptoms$Params>;

export const GetBriefSymptoms$Result = FetcherResult.extend({
  result: z.array(BriefSymptom).optional(),
  total: z.coerce.number().optional(),
});
export type GetBriefSymptoms$Result = z.infer<typeof GetBriefSymptoms$Result>;
