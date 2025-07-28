import { Db, ObjectId } from "mongodb";
import { DisplayPAP, GetPAP$Params } from "./typing";
import { PAP, UnixTimestamp, Allergen, Symptom } from "@/modules/business-types";


export async function handler$GetPAP(
    db: Db,
    params: GetPAP$Params
) {
    const { userId } = params;
    const resultPap = await db.collection("paps").findOne({ userId: new ObjectId(userId) });

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
            discoveryDate: UnixTimestamp | null,
            discoveryMethod: string,
            symptomsId: ObjectId[],
        }) => ({
            allergenId: allergen.allergenId.toHexString(),
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
                        prevalence: symptomDetails.prevalence,
                        treatment: symptomDetails.treatment
                    };
                }
            );
            return {
                allergenId: userAllergen.allergenId,
                discoveryDate: userAllergen.discoveryDate,
                discoveryMethod: userAllergen.discoveryMethod,
                name: allergenDetails.name,
                type: allergenDetails.type,
                severity: allergenSeverity,
                symptoms: populatedSymptoms,
            };
        },
    );

    const displayPAP = DisplayPAP.parse({
        ...pap,
        allergens: populatedAllergens,
    });
    return { PAP: displayPAP };
}