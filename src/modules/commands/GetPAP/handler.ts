import { Db, ObjectId } from "mongodb";
import { GetPAP$Params } from "./typing";
import { PAP, ObjectIdAsHexString, UnixTimestamp } from "@/modules/business-types";
import { z } from "zod";


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
        allergens: result.allergens.map((allergen: {
                        allergenId: ObjectId,
                        discoveryDate: UnixTimestamp,
                        discoveryMethod: String,
                        severity: number,
                        symptomsId: Array<String>,
                    }) => ({
            allergenId: allergen.allergenId.toHexString(),
            severity: allergen.severity,
            discoveryDate: allergen.discoveryDate,
            discoveryMethod: allergen.discoveryMethod,
            symptomsId: allergen.symptomsId,
        })),
    });
    return pap;
}