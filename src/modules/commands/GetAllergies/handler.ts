import { Db, ObjectId } from "mongodb";
import { GetAllergies$Params } from "./typing";
import { Allergy } from "@/modules/business-types";

export async function handler$GetAllergies(
    db: Db,
    params: GetAllergies$Params
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

    const allergiesResult = await db
        .collection('allergies')
        .aggregate([...sortTerm, ...filterTerm, ...pagingTerm])
        .toArray();

    const allergies = allergiesResult.map(doc => {
        return Allergy.parse({
            ...doc,
            id: doc._id.toHexString(),
            allergensId: doc.allergensId.map((id: ObjectId) => id.toHexString())
        });
    });

    return { allergies };
}