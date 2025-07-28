import { ObjectIdAsHexString } from "@/modules/business-types";
import z from "zod";

export const GetPAP$Params = z.object({
    userId: ObjectIdAsHexString.optional(),
});

export type GetPAP$Params = z.infer<typeof GetPAP$Params>;

export const DisplayPAP = z.object({
    id: ObjectIdAsHexString,
    userId: ObjectIdAsHexString,
    publicId: ObjectIdAsHexString,
    gender: z.enum(["male", "female", "other"]).nullable(),
    doB: z.date().nullable().default(null),
    allowPublic: z.boolean(),
    allergens: z.array(
        z.object({
            allergenId: ObjectIdAsHexString,
            name: z.string(),
            severity: z.number().min(1).max(3),
            type: z.enum(["food", "drug", "respiratory"]),
            discoveryDate: z.number(),
            discoveryMethod: z.enum(["Clinical symptoms", "Paraclinical tests"]),
            symptoms: z.array(z.object({
                symptomId: ObjectIdAsHexString,
                name: z.string(),
                severity: z.number().min(1).max(3),
                prevalence: z.number().min(1).max(5).default(1),
                treatment: z.string(),
            }))
        }),
    )
})

export type DisplayPAP = z.infer<typeof DisplayPAP>;

export const GetPAP$Result = z.object({
    success: z.boolean(),
    message: z.string().optional(),
    pap: DisplayPAP.optional(),
});

export type GetPAP$Result = z.infer<typeof GetPAP$Result>;