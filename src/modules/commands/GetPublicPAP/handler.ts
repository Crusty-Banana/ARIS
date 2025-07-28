import { Db, ObjectId } from "mongodb";
import { GetPublicPAP$Params, PublicPAP } from "./typing";
import { Allergen, PAP, Symptom, UnixTimestamp } from "@/modules/business-types";

export async function handler$GetPublicPAP(
    db: Db,
    params: GetPublicPAP$Params
) {
    const { publicId } = params;
    const resultPap = await db.collection("paps").findOne({ publicId: new ObjectId(publicId) });

    if (!resultPap) {
        return { publicPap: resultPap };
    }

    const pap = PAP.parse({
        ...resultPap,
        id: resultPap._id.toHexString(),
        userId: resultPap.userId.toHexString(),
        publicId: resultPap.publicId ? resultPap.publicId.toHexString() : null,
        allergens: resultPap.allergens.map((allergen: {
            allergenId: ObjectId,
            discoveryDate: UnixTimestamp,
            discoveryMethod: string,
            severity: number,
            symptomsId: ObjectId[],
        }) => ({
            allergenId: allergen.allergenId.toHexString(),
            severity: allergen.severity,
            discoveryDate: allergen.discoveryDate,
            discoveryMethod: allergen.discoveryMethod,
            symptomsId: allergen.symptomsId.map((symptomId: ObjectId) => symptomId.toHexString()),
        })),
    });

    const resultAllergens = await db
        .collection("allergens")
        .find({
            _id: {
                $in: pap.allergens.map(allergen => new ObjectId(allergen.allergenId)),
            },
        })
        .toArray();

    const allergens = resultAllergens.map((allergen) => {
        return Allergen.parse({
            ...allergen,
            id: allergen._id.toHexString(),
        });
    })

    const resultSymptoms = await db
        .collection("symptoms")
        .find({
            _id: {
                $in: pap.allergens.flatMap(allergen => allergen.symptomsId).map(symptomId => new ObjectId(symptomId)),
            },
        })
        .toArray();

    const symptoms = resultSymptoms.map((symptom) => {
        return Symptom.parse({
            ...symptom,
            id: symptom._id.toHexString(),
        });
    })

    const populatedAllergens = pap.allergens.map(
        (userAllergen) => {
            const allergenDetails = allergens.find(
                (allergen) =>
                    allergen.id === userAllergen.allergenId,
            );

            if (!allergenDetails) {
                throw new Error("Allergen not found");
            }

            let allergenSeverity = 1;
            const populatedSymptoms = userAllergen.symptomsId.map(
                (symptomId) => {
                    const symptomDetails = symptoms.find(
                        (symptom) =>
                            symptom.id === symptomId,
                    );

                    if (!symptomDetails) {
                        throw new Error("Symptom not found");
                    }
                    allergenSeverity = Math.max(allergenSeverity, symptomDetails.severity);
                    return {
                        symptomId: symptomDetails.id,
                        name: symptomDetails.name,
                        severity: symptomDetails.severity,
                        treatment: symptomDetails.treatment
                    };
                }
            );
            return {
                allergenId: userAllergen.allergenId,
                name: allergenDetails.name,
                type: allergenDetails.type,
                severity: allergenSeverity,
                symptoms: populatedSymptoms,
            };
        },
    );

    const publicPAP = PublicPAP.parse({
        publicId,
        allergens: populatedAllergens,
    });
    return { publicPAP };
}