import { ObjectIdAsHexString } from "@/modules/business-types";
import z from "zod";

export const GetPublicPAP$Params = z.object({
    publicId: ObjectIdAsHexString,
});

export type GetPublicPAP$Params = z.infer<typeof GetPublicPAP$Params>;

export const PublicPAP = z.object({
    publicId: ObjectIdAsHexString,
    allergens: z.array(
        z.object({
            allergenId: ObjectIdAsHexString,
            name: z.string(),
            severity: z.number().min(1).max(3),
            type: z.enum(["food", "drug", "respiratory"]),
            symptoms: z.array(z.object({
                symptomId: ObjectIdAsHexString,
                name: z.string(),
                severity: z.number().min(1).max(3),
                treatment: z.string(),
            }))
        }),
    )
})

export type PublicPAP = z.infer<typeof PublicPAP>

export const GetPublicPAP$Result = z.object({
    success: z.boolean(),
    message: z.string(),
    publicPAP: PublicPAP.optional(),
});

export type GetPublicPAP$Result = z.infer<typeof GetPublicPAP$Result>;