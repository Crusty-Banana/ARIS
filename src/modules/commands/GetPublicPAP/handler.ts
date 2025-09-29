import { Db, ObjectId } from "mongodb";
import {
  GetPublicPAP$Params,
  PublicPAP,
  PublicPAPAllergen,
  PublicPAPSymptom,
} from "./typing";
import {
  Allergen,
  BusisnessTypeCollection,
  PAP,
  Symptom,
} from "@/modules/business-types";

export async function handler$GetPublicPAP(
  db: Db,
  params: GetPublicPAP$Params
) {
  const { publicId } = params;
  const resultPap = await db.collection("paps").findOne({
    publicId: new ObjectId(publicId),
    allowPublic: true,
  });

  if (!resultPap) {
    return { result: resultPap };
  }

  const pap = PAP.parse({
    ...resultPap,
    id: resultPap._id.toHexString(),
    userId: resultPap.userId.toHexString(),
    publicId: resultPap.publicId.toHexString(),
  });

  const resultAllergens = await db
    .collection(BusisnessTypeCollection.allergens)
    .find({
      _id: {
        $in: pap.allergens.map((allergen) => new ObjectId(allergen.allergenId)),
      },
    })
    .toArray();

  const relatedAllergens = resultAllergens.map((allergen) => {
    return Allergen.parse({
      ...allergen,
      id: allergen._id.toHexString(),
    });
  });

  const resultSymptoms = await db
    .collection(BusisnessTypeCollection.symptoms)
    .find({
      _id: {
        $in: pap.allergens
          .flatMap((allergen) => allergen.symptomsId)
          .map((symptomId) => new ObjectId(symptomId)),
      },
    })
    .toArray();

  const relatedSymptoms = resultSymptoms.map((symptom) => {
    return Symptom.parse({
      ...symptom,
      id: symptom._id.toHexString(),
    });
  });

  const populatedAllergens = pap.allergens.map((userAllergen) => {
    const allergenDetails = relatedAllergens.find(
      (allergen) => allergen.id === userAllergen.allergenId
    );

    if (!allergenDetails) {
      throw new Error("Allergen not found");
    }

    let allergenSeverity = 1;
    const populatedSymptoms = userAllergen.symptomsId.map((symptomId) => {
      const symptomDetails = relatedSymptoms.find(
        (symptom) => symptom.id === symptomId
      );

      if (!symptomDetails) {
        throw new Error(`Symptom not found ${symptomId}`);
      }
      allergenSeverity = Math.max(allergenSeverity, symptomDetails.severity);
      return PublicPAPSymptom.parse({
        ...symptomDetails,
        symptomId,
      });
    });
    return PublicPAPAllergen.parse({
      ...userAllergen,
      ...allergenDetails,
      severity: allergenSeverity,
      symptoms: populatedSymptoms,
    });
  });

  const publicPAP = PublicPAP.parse({
    publicId,
    allergens: populatedAllergens,
  });
  return { result: publicPAP };
}
