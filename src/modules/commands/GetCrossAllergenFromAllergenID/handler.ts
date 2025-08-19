import { Db, ObjectId } from "mongodb";
import { GetCrossAllergenFromAllergenID$Params } from "./typing";
import { Allergen, BusisnessTypeCollection } from "@/modules/business-types";


export async function handler$GetCrossAllergenFromAllergenID(
    db: Db,
    params: GetCrossAllergenFromAllergenID$Params
) {
    const { allergenID } = params;
    // 1. Find all allergy categories that contain the specified allergen
    const relatedAllergies = await db.collection(BusisnessTypeCollection.allergies).find({
        allergensId: allergenID
    }).toArray();

    // 2. Collect all unique allergen IDs from these categories, excluding the original allergen
    const crossAllergenIds = new Set<string>();
    relatedAllergies.forEach(allergy => {
        allergy.allergensId.forEach((xallergenId: ObjectId) => {
            const allergenIdStr = xallergenId.toString();
            if (allergenIdStr !== allergenID) {
                crossAllergenIds.add(allergenIdStr);
            }
        });
    });

    const uniqueCrossAllergenIds = Array.from(crossAllergenIds).map(idStr => ObjectId.createFromHexString(idStr));

    // 3. Fetch the details of the cross-allergens
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