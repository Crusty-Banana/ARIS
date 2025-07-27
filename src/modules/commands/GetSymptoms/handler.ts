import { Symptom } from "@/modules/business-types";
import { Db, ObjectId } from "mongodb";
import { GetSymptoms$Params } from "./typing";

export async function handler$GetSymptoms(
    db: Db,
    params: GetSymptoms$Params
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
        .collection("symptoms")
        .aggregate([...sortTerm, ...filterTerm, ...pagingTerm])
        .toArray();

    const symptoms = docs.map((doc) => {
        return Symptom.parse({
            id: doc._id.toHexString(),
            ...doc,
        });
    });

    return { symptoms };
}