import { Db, ObjectId } from "mongodb";
import { GetPublicPAP$Params } from "./typing";
import { Allergen, PAP, PAPAllergen, PublicPAP } from "@/modules/business-types";

export async function handler$GetPublicPAP(
    db: Db,
    params: GetPublicPAP$Params
) {
    const { publicId } = params;
    const papResult = await db.collection("paps").findOne({ publicId: new ObjectId(publicId), allowPublic: true });

    if (!papResult) {
        return null;
    }

    const pap = PAP.parse({
        ...papResult,
        id: papResult._id.toHexString(),
        userId: papResult.userId.toHexString(),
        publicId: papResult.publicId ? papResult.publicId.toHexString() : null,
        allergens: papResult.allergens.map((allergen: { allergenId: ObjectId, degree: number }) => ({
            allergenId: allergen.allergenId.toHexString(),
            degree: allergen.degree,
        })),
    });

    const allergensResult = await db
        .collection("allergens")
        .find({
            _id: {
                $in: pap.allergens.map((a: PAPAllergen) => new ObjectId(a.allergenId)),
            },
        })
        .toArray();

    const allergens = allergensResult.map((allergen) => {
        return Allergen.parse({
            id: allergen._id.toHexString(),
            ...allergen,
        });
    })

    const populatedAllergens = pap.allergens.map(
        (userAllergen: PAPAllergen) => {
            const allergenDetails = allergens.find(
                (allergen) =>
                    allergen.id === userAllergen.allergenId,
            );
            return {
                name: allergenDetails ? allergenDetails.name : "Unknown",
                degree: userAllergen.degree,
                symptoms: allergenDetails ? allergenDetails.symptoms : [],
                treatment: allergenDetails ? allergenDetails.treatment : "",
                firstAid: allergenDetails ? allergenDetails.firstAid : "",
            };
        },
    );

    const publicPap = PublicPAP.parse({
        gender: pap.gender,
        doB: pap.doB,
        allergens: populatedAllergens,
    });
    return publicPap;
}