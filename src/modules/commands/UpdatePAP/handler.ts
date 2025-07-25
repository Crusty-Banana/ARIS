import { Db, ObjectId } from "mongodb";
import { UpdatePAP$Params } from "./typing";

export async function handler$UpdatePAP(
    db: Db,
    params: UpdatePAP$Params
) {
    const { userId, allergens, ...PAPdata } = params;
    const result = await db.collection("paps").updateOne(
        { userId: new ObjectId(userId) },
        {
            $set: {
                ...PAPdata,
                ...(allergens ? {
                    allergens: allergens.map(allergen => ({
                        allergenId: new ObjectId(allergen.allergenId),
                        degree: allergen.degree,
                    }))
                } : {})
            }
        }
    );
    return result;

}