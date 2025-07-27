import { Db, ObjectId } from "mongodb";
import { DeleteSymptom$Params } from "./typing";

export async function handler$DeleteSymptom(
    db: Db,
    params: DeleteSymptom$Params
) {
    const { id } = params;
    const result = await db.collection('symptoms').deleteOne({ _id: new ObjectId(id) });
    return { result };
}