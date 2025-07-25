import { Db, ObjectId } from "mongodb";
import { GetPAP$Params } from "./typing";
import { PAP } from "@/modules/business-types";

export async function handler$GetPAP(
    db: Db,
    params: GetPAP$Params
) {
    const { userId } = params;
    const result = await db.collection("paps").findOne({ userId: new ObjectId(userId) });

    if (!result) {
        return null;
    }

    const pap = PAP.parse({
        ...result,
        id: result._id.toHexString(),
        userId: result.userId.toHexString(),
        publicId: result.publicId ? result.publicId.toHexString() : null,
        allergens: result.allergens.map((allergen: { allergenId: ObjectId, degree: number }) => ({
            allergenId: allergen.allergenId.toHexString(),
            degree: allergen.degree,
        })),
    });
    return pap;
}