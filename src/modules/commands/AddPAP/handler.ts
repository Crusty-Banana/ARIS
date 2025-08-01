import { Db, ObjectId } from "mongodb";
import { AddPAP$Params } from "./typing";

export async function handler$AddPAP(
    db: Db,
    params: AddPAP$Params
) {
    const { userId } = params;
    await db.collection('paps').insertOne({
        userId: new ObjectId(userId),
        publicId: new ObjectId(),
        allowPublic: true,
        gender: "",
        doB: null,
        underlyingMedCon: [],
        allergens: [],
    });
}