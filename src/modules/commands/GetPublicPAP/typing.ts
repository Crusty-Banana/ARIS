import { ObjectIdAsHexString, PublicPAP } from "@/modules/business-types";
import z from "zod";

export const GetPublicPAP$Params = z.object({
    publicId: ObjectIdAsHexString,
});

export type GetPublicPAP$Params = z.infer<typeof GetPublicPAP$Params>;

export const GetPublicPAP$Result = z.object({
    message: z.string().optional(),
    publicPAP: PublicPAP.optional(),
});

export type GetPublicPAP$Result = z.infer<typeof GetPublicPAP$Result>;