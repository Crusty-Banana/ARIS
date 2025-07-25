import { Allergen } from "@/modules/business-types";
import { Db, ObjectId } from "mongodb";
import { GetAllergens$Params } from "./typing";

export async function handler$GetAllergens(
    db: Db,
    params: GetAllergens$Params
) {
    const { id, limit, offset } = params;

    const filterTerm = id ? [
        {
            $match: {
                ...(id ? { _id: ObjectId.createFromHexString(id) } : {}),
            },
        },
    ] : [];

    const pagingTerm = [
        ...(offset ? [{ $skip: offset }] : []),
        { $limit: limit || 200 },
    ];

    const sortTerm = [
        {
            $sort: {
                name: 1,
            },
        },
    ];

    const docs = await db
        .collection("allergens")
        .aggregate([...sortTerm, ...filterTerm, ...pagingTerm])
        .toArray();

    const allergens = docs.map((doc) => {
        return Allergen.parse({
            id: doc._id.toHexString(),
            ...doc,
        });
    });

    return { allergens };
}