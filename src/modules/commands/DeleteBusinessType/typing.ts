import { ObjectIdAsHexString } from "@/modules/business-types";
import { z } from "zod";

export const DeleteBusinessType$Params = z.object({
  id: ObjectIdAsHexString,
});
export type DeleteBusinessType$Params = z.infer<typeof DeleteBusinessType$Params>;