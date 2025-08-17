import { FetcherResult, PAP } from "@/modules/business-types";
import z from "zod";

export const PAPAllergen = PAP.shape.allergens._def.innerType.element;
export type PAPAllergen = z.infer<typeof PAPAllergen>;

export const UpdatePAPWithUserId$Params = PAP
    .omit({ allergens: true, id: true, publicId: true })
    .extend({ allergens: z.array(PAPAllergen) })
    .partial().required({ userId: true });
export type UpdatePAPWithUserId$Params = z.infer<typeof UpdatePAPWithUserId$Params>;

export const UpdatePAPWithUserIdFetcher$Params = UpdatePAPWithUserId$Params.omit({ userId: true });
export type UpdatePAPWithUserIdFetcher$Params = z.infer<typeof UpdatePAPWithUserIdFetcher$Params>;

export const UpdatePAPWithUserId$Result = FetcherResult;
export type UpdatePAPWithUserId$Result = z.infer<typeof UpdatePAPWithUserId$Result>;

export const UpdatePAPAllergen$Params = PAPAllergen.partial().omit({ allergenId: true });
export type UpdatePAPAllergen$Params = z.infer<typeof UpdatePAPAllergen$Params>;