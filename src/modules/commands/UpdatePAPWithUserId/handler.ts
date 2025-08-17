import { Db, ObjectId } from "mongodb";
import { UpdatePAPWithUserId$Params } from "./typing";

export async function handler$UpdatePAPWithUserId(
    db: Db,
    params: UpdatePAPWithUserId$Params
) {
    const { userId, allergens, ...PAPdata } = params;
    const result = await db.collection("paps").updateOne(
        { userId: new ObjectId(userId) },
        {
            $set: {
                ...PAPdata,
                ...(allergens ? {
                    allergens: allergens.map(allergen => ({
                        ...allergen,
                        allergenId: new ObjectId(allergen.allergenId),
                        ...(allergen.symptomsId ? { symptomsId: allergen.symptomsId.map(symptomId => new ObjectId(symptomId)) } : {}),
                    }))
                } : {})
            }
        }
    );
    return { result: result.modifiedCount };

}