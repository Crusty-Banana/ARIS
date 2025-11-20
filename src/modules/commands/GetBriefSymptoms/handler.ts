import { Db, ObjectId } from "mongodb";
import { BriefSymptom, GetBriefSymptoms$Params } from "./typing";
import { BusisnessTypeCollection } from "@/modules/business-types";
import { count } from "console";

export async function handler$GetBriefSymptoms(
  db: Db,
  params: GetBriefSymptoms$Params
) {
  const { ids, name, organ, sort, sortBy, page, limit, lang } = params;

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
        ...(organ ? { organ: organ } : {}),
      },
    },
  ];

  let sortField = `name.${lang}`;
  if (sortBy === "severity") sortField = "severity";

  const sortTerm = [{ $sort: { [sortField]: sort === "desc" ? -1 : 1 } }];

  const pagingTerm = page
    ? [{ $skip: (page - 1) * 100 }, { $limit: limit ? limit : 100 }]
    : [];

  const docs = await db
    .collection(BusisnessTypeCollection.symptoms)
    .aggregate([...filterTerm, ...sortTerm, ...pagingTerm])
    .toArray();

  const parsedDocs = docs.map((doc) =>
    BriefSymptom.parse({
      ...doc,
      id: doc._id.toHexString(),
      name: lang ? doc.name[lang] : doc.name["en"],
    })
  );

  const countDoc = await db
    .collection(BusisnessTypeCollection.symptoms)
    .aggregate([...filterTerm, { $group: { _id: "", count: { $sum: 1 } } }])
    .toArray();

  const count = countDoc.length > 0 ? countDoc[0].count : 0;

  return { result: parsedDocs, total: count };
}
