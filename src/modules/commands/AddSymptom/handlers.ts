import { Db } from "mongodb";
import { AddSymptom$Params } from "./typing";

export async function handler$AddSymptom(
    db: Db,
    params: AddSymptom$Params
) {
    const { insertedId } = await db.collection("symptoms").insertOne(params)
    return { insertedId: insertedId.toHexString() };
}