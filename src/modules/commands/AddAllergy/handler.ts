import { Db, ObjectId } from "mongodb";
import { AddAllergy$Params } from "./typing";

export async function handler$AddAllergy(
    db: Db,
    params: AddAllergy$Params
) {
    const { name, allergensId } = params
    const { insertedId } = await db.collection("allergies").insertOne({
        name,
        allergensId: allergensId.map(id => new ObjectId(id))
    })
    return { insertedId: insertedId.toHexString() };
}