import { Db, ObjectId } from "mongodb";
import { DeleteAllergy$Params } from "./typing";

export async function handler$DeleteAllergy(
    db: Db,
    params: DeleteAllergy$Params
) {
    const { id } = params;
    const result = await db.collection('allergies').deleteOne({ _id: new ObjectId(id) });
    return { result };
}