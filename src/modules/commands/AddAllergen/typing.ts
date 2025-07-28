import { Allergen } from "@/modules/business-types";
import { z } from "zod";

export const AddAllergen$Params = Allergen.omit({ id: true });
export type AddAllergen$Params = z.infer<typeof AddAllergen$Params>;

export const AddAllergen$Result = z.object({
    success: z.boolean(),
    message: z.string(),
    allergenId: z.string().optional(),
})
export type AddAllergen$Result = z.infer<typeof AddAllergen$Result>;