import { Db, ObjectId } from "mongodb";
import { BusisnessTypeCollection } from "@/modules/business-types";
import { DetailAllergen, GetDetailAllergen$Params } from "./typing";

export async function handler$GetDetailAllergen(
  db: Db,
  params: GetDetailAllergen$Params
) {
  const { id } = params;

  const pipeline = [
    {
      $match: { _id: ObjectId.createFromHexString(id) },
    },
    {
      $lookup: {
        from: BusisnessTypeCollection.allergens,
        let: { crossSenIds: "$crossSensitivityId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: [
                  "$_id",
                  {
                    $map: {
                      input: { $ifNull: ["$$crossSenIds", []] },
                      as: "csid",
                      in: { $toObjectId: "$$csid" },
                    },
                  },
                ],
              },
            },
          },
          {
            $project: { name: 1, _id: 1 },
          },
        ],
        as: "crossSensitivities",
      },
    },
  ];

  const results = await db
    .collection(BusisnessTypeCollection.allergens)
    .aggregate(pipeline)
    .toArray();

  const resultAllergen = results[0];

  if (!resultAllergen) {
    return { result: null };
  }

  const parsedDocs = DetailAllergen.parse({
    id: resultAllergen._id.toHexString(),
    ...resultAllergen,
    crossSensitivities: resultAllergen.crossSensitivities.map(
      (sensitivity: any) => {
        return {
          id: sensitivity._id.toHexString(),
          name: sensitivity.name,
        };
      }
    ),
  });

  return { result: parsedDocs };
}
