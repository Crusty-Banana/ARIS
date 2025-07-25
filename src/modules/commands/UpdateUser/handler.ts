import { Db, ObjectId } from "mongodb";
import { UpdateUser$Params } from "./typing";

export async function handler$UpdateUser(
    db: Db,
    params: UpdateUser$Params
) {
    const { id, ...updateData } = params;
    const userId = new ObjectId(id);

    const result = await db
        .collection("users")
        .updateOne({ _id: userId }, { $set: updateData });

    return result;
}