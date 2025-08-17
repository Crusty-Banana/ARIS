import { Allergen, DiscoveryMethod, FetcherResult, ObjectIdAsHexString, PAP, Symptom, UnixTimestamp } from "@/modules/business-types";
import z from "zod";

export const GetPAPWithUserId$Params = z.object({
    userId: ObjectIdAsHexString.optional(),
});

export type GetPAPWithUserId$Params = z.infer<typeof GetPAPWithUserId$Params>;

export const DisplayPAPSymptom = Symptom.omit({ id: true }).extend({ symptomId: ObjectIdAsHexString });
export type DisplayPAPSymptom = z.infer<typeof DisplayPAPSymptom>;

export const DisplayPAPAllergen = Allergen.omit({
    id: true,
    description: true,
    symptomsId: true,
}).extend({
    allergenId: ObjectIdAsHexString,
    severity: z.number().min(1).max(3),
    discoveryDate: UnixTimestamp.nullable(),
    discoveryMethod: DiscoveryMethod,
    symptoms: z.array(DisplayPAPSymptom),
});
export type DisplayPAPAllergen = z.infer<typeof DisplayPAPAllergen>;

export const DisplayPAP = PAP.omit({
    allergens: true
}).extend({
    allergens: z.array(DisplayPAPAllergen),
});
export type DisplayPAP = z.infer<typeof DisplayPAP>;

// export const DbPAPAllergen = PAP.shape.allergens._def.innerType.element.omit({
//     allergenId: true,
//     symptomsId: true,
// }).extend({
//     allergenId: z.instanceof(ObjectId),
//     symptomsId: z.array(z.instanceof(ObjectId)),
// });
// export type DbPAPAllergen = z.infer<typeof DbPAPAllergen>;

export const GetPAPWithUserId$Result = FetcherResult.extend({
    result: DisplayPAP.optional(),
})
export type GetPAPWithUserId$Result = z.infer<typeof GetPAPWithUserId$Result>;