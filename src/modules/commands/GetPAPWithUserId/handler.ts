import { Db, ObjectId } from "mongodb";
import {
  DisplayPAP,
  DisplayPAPAllergen,
  DisplayPAPSymptom,
  GetPAPWithUserId$Params,
} from "./typing";
import {
  PAP,
  Allergen,
  Symptom,
  BusisnessTypeCollection,
} from "@/modules/business-types";

export async function handler$GetPAPWithUserId(
  db: Db,
  params: GetPAPWithUserId$Params
) {
  const { userId } = params;
  const resultPAP = await db
    .collection("paps")
    .findOne({ userId: new ObjectId(userId) });

  if (!resultPAP) {
    return { result: resultPAP };
  }

  const pap = PAP.parse({
    ...resultPAP,
    id: resultPAP._id.toHexString(),
    userId: resultPAP.userId.toHexString(),
    publicId: resultPAP.publicId.toHexString(),
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
      return DisplayPAPSymptom.parse({
        ...symptomDetails,
        symptomId,
      });
    });
    return DisplayPAPAllergen.parse({
      ...userAllergen,
      ...allergenDetails,
      severity: allergenSeverity,
      symptoms: populatedSymptoms,
    });
  });

  const displayPAP = DisplayPAP.parse({
    ...pap,
    allergens: populatedAllergens,
  });

  return { result: displayPAP };
}
