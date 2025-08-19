import { Db, ObjectId } from "mongodb";
import { GetCrossAllergenFromUserID$Params } from "./typing";
import { Allergen, BusisnessTypeCollection } from "@/modules/business-types";


export async function handler$GetCrossAllergenFromUserID(
    db: Db,
    params: GetCrossAllergenFromUserID$Params
) {
    const { userID } = params;
    const result = await db.collection("paps").findOne({ userId: new ObjectId(userID) });

    if (!result || !result.allergens || result.allergens.length === 0) {
        return { result: [] as Allergen[] };
    }
    const userAllergenIds = result.allergens.map((allergen: { allergenId: ObjectId, degree: number }) => (
        allergen.allergenId.toString()
    ));

    // 2. Find all allergy categories that contain any of the user's allergens
    const relatedAllergies = await db.collection(BusisnessTypeCollection.allergies).find({
        allergensId: { $in: userAllergenIds }
    }).toArray();

    // 3. Collect all unique allergen IDs from these categories, excluding the user's own allergens
    const crossAllergenIds = new Set<string>();
    relatedAllergies.forEach(allergy => {
        allergy.allergensId.forEach((allergenId: ObjectId) => {
            const allergenIdStr = allergenId.toString();

            if (!userAllergenIds.some((id: ObjectId) => id.toString() === allergenIdStr)) {
                crossAllergenIds.add(allergenIdStr);
            }
        });
    });
    const uniqueCrossAllergenIds = Array.from(crossAllergenIds).map(id => ObjectId.createFromHexString(id));

    // 4. Fetch the details of the cross-allergens
    const crossAllergens = await db.collection(BusisnessTypeCollection.allergens).find({
        _id: { $in: uniqueCrossAllergenIds }
    }).toArray();

    const allergens = crossAllergens.map((doc) => {
        return Allergen.parse({
            id: doc._id.toHexString(),
            ...doc,
        });
    });
    return { result: allergens };
}