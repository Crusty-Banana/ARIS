import { Db, ObjectId } from "mongodb";
import { UpdateAllergy$Params } from "./typing";

export async function handler$UpdateAllergy(
    db: Db,
    params: UpdateAllergy$Params
) {
    const { id, allergensId, name } = params;
    const result = await db
        .collection("allergies")
        .updateOne({ _id: new ObjectId(id) }, {
            $set: {
                ...(name ? { name } : {}),
                ...(allergensId ? { allergensId: allergensId.map(id => new ObjectId(id)) } : {})
            }
        });

    return { result };
}