import { Db } from "mongodb";
import { AddAllergen$Params } from "./typing";

export async function handler$AddAllergen(
    db: Db,
    params: AddAllergen$Params,
) {
    const result = await db.collection('allergens').insertOne(params);
    return result;
}