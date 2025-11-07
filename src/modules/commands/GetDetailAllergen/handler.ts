import { Db, ObjectId } from "mongodb";
import { BusisnessTypeCollection } from "@/modules/business-types";
import { DetailAllergen, GetDetailAllergen$Params } from "./typing";
import { describe } from "node:test";

export async function handler$GetDetailAllergen(
  db: Db,
  params: GetDetailAllergen$Params
) {
  const { id } = params;

  const resultAllergen = await db
    .collection(BusisnessTypeCollection.allergens)
    .findOne({ _id: ObjectId.createFromHexString(id) });

  if (!resultAllergen) {
    return { result: resultAllergen };
  }

  const resultCrossSensitivities = await db
    .collection(BusisnessTypeCollection.allergens)
    .aggregate([
      {
        $match: {
          _id: {
            $in: resultAllergen.crossSensitivityId.map((id: string) =>
              ObjectId.createFromHexString(id)
            ),
          },
        },
      },
    ])
    .toArray();

  const parsedDocs = DetailAllergen.parse({
    id: resultAllergen._id.toHexString(),
    ...resultAllergen,
    crossSensitivities: resultCrossSensitivities.map((sensitivity) => {
      return {
        id: sensitivity._id.toHexString(),
        name: sensitivity.name,
      };
    }),
  });

  return { result: parsedDocs };
}
