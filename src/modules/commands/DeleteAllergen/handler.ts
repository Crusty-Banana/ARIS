import { Db } from "mongodb";
import { DeleteAllergen$Params } from "./typing";

export async function handler$DeleteAllergen(
    db: Db,
    params: DeleteAllergen$Params
) {
    const { id } = params;
    const result = await db.collection('allergens').deleteOne({ id });
    return result;
}