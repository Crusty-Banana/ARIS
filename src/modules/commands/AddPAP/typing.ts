import { ObjectIdAsHexString } from "@/modules/business-types";
import z from "zod";

export const AddPAP$Params = z.object({
    userId: ObjectIdAsHexString,
});
export type AddPAP$Params = z.infer<typeof AddPAP$Params>;