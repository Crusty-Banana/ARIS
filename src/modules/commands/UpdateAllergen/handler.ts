import { Db, ObjectId } from "mongodb";
import { UpdateAllergen$Params } from "./typing";

export async function handler$UpdateAllergen(
    db: Db,
    params: UpdateAllergen$Params
) {
    const { id, ...allergenData } = params;
    const result = await db
        .collection("allergens")
        .updateOne({ _id: new ObjectId(id) }, { $set: allergenData });

    return result;
}