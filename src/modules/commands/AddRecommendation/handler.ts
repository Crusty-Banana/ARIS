import { Db } from "mongodb";
import { AddRecommendation$Params } from "./typing";

export async function handler$AddRecommendation(
    db: Db,
    params: AddRecommendation$Params,
) {
    const { insertedId } = await db.collection('recommendations').insertOne(params);
    return { insertedId: insertedId.toHexString() };
}