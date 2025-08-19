import { ObjectIdAsHexString } from "@/modules/business-types";
import z from "zod";

export const AddPAPWithUserId$Params = z.object({
    userId: ObjectIdAsHexString,
});
export type AddPAPWithUserId$Params = z.infer<typeof AddPAPWithUserId$Params>;