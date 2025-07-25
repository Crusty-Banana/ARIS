import { ObjectIdAsHexString, PAP } from "@/modules/business-types";
import z from "zod";

export const GetPAP$Params = z.object({
    userId: ObjectIdAsHexString,
});

export type GetPAP$Params = z.infer<typeof GetPAP$Params>;

export const GetPAP$Result = z.object({
    message: z.string().optional(),
    pap: PAP.optional(),
});

export type GetPAP$Result = z.infer<typeof GetPAP$Result>;