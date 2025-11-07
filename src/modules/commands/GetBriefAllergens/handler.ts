import { Db, ObjectId } from "mongodb";
import { BusisnessTypeCollection } from "@/modules/business-types";
import { BriefAllergen, GetBriefAllergens$Params } from "./typing";

export async function handler$GetBriefAllergens(
  db: Db,
  params: GetBriefAllergens$Params
) {
  const { ids, lang, name, type, sort, page } = params;

  const filterTerm = [
    {
      $match: {
        ...(ids
          ? {
              _id: {
                $in: ids.map((id) => ObjectId.createFromHexString(id)),
              },
            }
          : {}),
        ...(name ? { [`name.${lang}`]: { $regex: name, $options: "i" } } : {}),
        ...(type ? { type: type } : {}),
      },
    },
  ];

  const pagingTerm = page ? [{ $limit: 100 }, { $skip: (page - 1) * 100 }] : [];

  const sortTerm = [
    {
      $sort: { [`name.${lang}`]: sort === "asc" ? 1 : -1 },
    },
  ];

  console.log("check");

  const docs = await db
    .collection(BusisnessTypeCollection.allergens)
    .aggregate([...filterTerm, ...sortTerm, ...pagingTerm])
    .toArray();

  console.log("check1");

  const parsedDocs = docs.map((doc) =>
    BriefAllergen.parse({ ...doc, id: doc._id.toHexString() })
  );

  const countDoc = await db
    .collection(BusisnessTypeCollection.allergens)
    .aggregate([
      ...filterTerm,
      ...pagingTerm,
      { $group: { _id: "", count: { $sum: 1 } } },
    ])
    .toArray();

  console.log("check2");

  const count = countDoc.length ? countDoc[0].count : 0;

  return { result: parsedDocs, total: count };
}
