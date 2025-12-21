import { Db, ObjectId } from "mongodb";
import { BusisnessTypeCollection, PAP } from "@/modules/business-types";
import { GetRemainAllergens$Params, RemainAllergen } from "./typing";

export async function handler$GetRemainAllergens(
  db: Db,
  params: GetRemainAllergens$Params
) {
  const { userId, lang, name } = params;

  const resultPAP = await db
    .collection("paps")
    .findOne({ userId: ObjectId.createFromHexString(userId) });

  if (!resultPAP) {
    return { result: resultPAP };
  }

  const pap = PAP.parse({
    ...resultPAP,
    id: resultPAP._id.toHexString(),
    userId: resultPAP.userId.toHexString(),
    publicId: resultPAP.publicId.toHexString(),
  });

  const excludedIds = pap.allergens.map((allergen) => allergen.allergenId);

  const filterTerm = [
    {
      $match: {
        _id: {
          $nin: excludedIds.map((id) => ObjectId.createFromHexString(id)),
        },
        ...(name ? { [`name.${lang}`]: { $regex: name, $options: "i" } } : {}),
      },
    },
  ];

  const docs = await db
    .collection(BusisnessTypeCollection.allergens)
    .aggregate([...filterTerm])
    .toArray();

  const parsedDocs = docs.map((doc) =>
    RemainAllergen.parse({
      ...doc,
      name: doc.name[lang],
      id: doc._id.toHexString(),
      description: doc.description[lang],
    })
  );

  return { result: parsedDocs };
}
