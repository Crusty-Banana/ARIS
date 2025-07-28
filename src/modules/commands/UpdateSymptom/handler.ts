import { Db, ObjectId } from "mongodb";
import { UpdateSymptom$Params } from "./typing";

export async function handler$UpdateSymptom(
    db: Db,
    params: UpdateSymptom$Params
) {
    const { id, ...symptomData } = params;
    const result = await db
        .collection("symptoms")
        .updateOne({ _id: new ObjectId(id) }, { $set: symptomData });

    return { result };
}