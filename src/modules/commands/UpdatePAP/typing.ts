import { DiscoveryMethod, Gender, ObjectIdAsHexString, UnixTimestamp } from "@/modules/business-types";
import z from "zod";

export const UpdatePAP$Params = z.object({
    userId: ObjectIdAsHexString,
    allowPublic: z.boolean().optional(),
    gender: Gender.optional(),
    doB: UnixTimestamp.nullable().optional(),
    allergens: z.array(
        z.object({
            allergenId: ObjectIdAsHexString,
            discoveryDate: UnixTimestamp.nullable().optional(),
            discoveryMethod: DiscoveryMethod.optional(),
            symptomsId: z.array(ObjectIdAsHexString).optional(),
        }),
    ).optional(),
});

export type UpdatePAP$Params = z.infer<typeof UpdatePAP$Params>;

export const UpdatePAPAllergens$Params = UpdatePAP$Params.pick({
    allergens: true,
})
export type UpdatePAPAllergens$Params = z.infer<typeof UpdatePAPAllergens$Params>;

export const UpdatePAPAllergen$Params = UpdatePAP$Params.shape.allergens.unwrap().element;
export type UpdatePAPAllergen$Params = z.infer<typeof UpdatePAPAllergen$Params>;

export const UpdatePAPFetcher$Params = UpdatePAP$Params.omit({
    userId: true,
});
export type UpdatePAPFetcher$Params = z.infer<typeof UpdatePAPFetcher$Params>;

export const UpdatePAP$Result = z.object({
    success: z.boolean(),
    message: z.string(),
});
export type UpdatePAP$Result = z.infer<typeof UpdatePAP$Result>;