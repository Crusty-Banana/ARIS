import { z } from "zod";
import { ObjectIdAsHexString } from "@/modules/business-types";

export const DeleteUser$Params = z.object({
  id: ObjectIdAsHexString,
});
export type DeleteUser$Params = z.infer<typeof DeleteUser$Params>;
