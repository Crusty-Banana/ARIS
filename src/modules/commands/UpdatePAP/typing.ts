import { ObjectIdAsHexString, UnixTimestamp } from "@/modules/business-types";
import z from "zod";

export const UpdatePAP$Params = z.object({
    userId: ObjectIdAsHexString,
    allowPublic: z.boolean().optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    doB: UnixTimestamp.optional(),
    allergens: z.array(
        z.object({
            allergenId: ObjectIdAsHexString,
            discoveryDate: UnixTimestamp.optional(),
            discoveryMethod: z.enum(["Clinical symptoms", "Paraclinical tests"]).optional(),
            symptomsId: z.array(ObjectIdAsHexString).min(1).optional(),
        }),
    ).optional(),
});

export type UpdatePAP$Params = z.infer<typeof UpdatePAP$Params>;

export const UpdatePAPFetcher$Params = UpdatePAP$Params.omit({
    userId: true,
});
export type UpdatePAPFetcher$Params = z.infer<typeof UpdatePAPFetcher$Params>;

export const UpdatePAP$Result = z.object({
    success: z.boolean(),
    message: z.string(),
});
export type UpdatePAP$Result = z.infer<typeof UpdatePAP$Result>;