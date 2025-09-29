import { Db, ObjectId } from "mongodb";
import { GetCrossAllergenFromUserID$Params } from "./typing";
import { Allergen, BusisnessTypeCollection } from "@/modules/business-types";

export async function handler$GetCrossAllergenFromUserID(
  db: Db,
  params: GetCrossAllergenFromUserID$Params
) {
  const { userID } = params;

  // 1. Get user's allergen IDs from pap
  const pap = await db
    .collection("paps")
    .findOne({ userId: new ObjectId(userID) });
  if (!pap || !pap.allergens || pap.allergens.length === 0) {
    return { result: [] as Allergen[] };
  }

  const userAllergenIds = pap.allergens.map((a: { allergenId: string }) =>
    ObjectId.createFromHexString(a.allergenId)
  );
  // 2. Fetch user allergens from Allergens collection to get their cross sensitivities
  const userAllergenDocs = await db
    .collection(BusisnessTypeCollection.allergens)
    .find({
      _id: { $in: userAllergenIds },
    })
    .toArray();
  // 3. Collect cross-allergen IDs from those documents
  const crossAllergenIds = new Set<string>();
  userAllergenDocs.forEach((doc) => {
    if (Array.isArray(doc.crossSensitivityId)) {
      doc.crossSensitivityId.forEach((allergenId: ObjectId) => {
        const idStr = allergenId.toString();
        if (
          !userAllergenIds.some(
            (allergenId: ObjectId) => allergenId.toString() === idStr
          )
        ) {
          crossAllergenIds.add(idStr);
        }
      });
    }
  });

  if (crossAllergenIds.size === 0) {
    return { result: [] as Allergen[] };
  }

  // 4. Fetch details of unique cross-allergens
  const uniqueCrossAllergenIds = Array.from(crossAllergenIds).map((id) =>
    ObjectId.createFromHexString(id)
  );

  const crossAllergens = await db
    .collection(BusisnessTypeCollection.allergens)
    .find({
      _id: { $in: uniqueCrossAllergenIds },
    })
    .toArray();

  const allergens = crossAllergens.map((doc) =>
    Allergen.parse({
      id: doc._id.toHexString(),
      ...doc,
    })
  );

  return { result: allergens };
}
