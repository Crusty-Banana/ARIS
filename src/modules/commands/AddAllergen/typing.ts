import { Allergen } from "@/modules/business-types";
import { z } from "zod";

export const AddAllergen$Params = Allergen.omit({ id: true });
export type AddAllergen$Params = z.infer<typeof AddAllergen$Params>;