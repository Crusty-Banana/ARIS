import { ObjectIdAsHexString } from "@/modules/business-types";
import z from "zod";
import { DisplayPAP } from "../GetPAPWithUserId/typing";

export const GetPublicPAP$Params = z.object({
    publicId: ObjectIdAsHexString,
});

export type GetPublicPAP$Params = z.infer<typeof GetPublicPAP$Params>;

export const PublicPAPSymptom = DisplayPAP.shape.allergens.element.shape.symptoms.element

export type PublicPAPSymptom = z.infer<typeof PublicPAPSymptom>

export const PublicPAPAllergen = DisplayPAP.shape.allergens.element.omit({
    symptoms: true,
    discoveryDate: true,
}).extend({
    symptoms: z.array(PublicPAPSymptom)
})

export const PublicPAP = z.object({
    publicId: ObjectIdAsHexString,
    allergens: z.array(PublicPAPAllergen),
})

export type PublicPAP = z.infer<typeof PublicPAP>

export const GetPublicPAP$Result = z.object({
    success: z.boolean(),
    message: z.string(),
    result: PublicPAP.optional(),
});

export type GetPublicPAP$Result = z.infer<typeof GetPublicPAP$Result>;