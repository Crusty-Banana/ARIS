import { ObjectIdAsHexString } from "@/modules/business-types";
import z from "zod";

export const DeleteAllergy$Params = z.object({
    id: ObjectIdAsHexString
});

export type DeleteAllergy$Params = z.infer<typeof DeleteAllergy$Params>;

export const DeleteAllergy$Result = z.object({
    message: z.string(),
});

export type DeleteAllergy$Result = z.infer<typeof DeleteAllergy$Result>;