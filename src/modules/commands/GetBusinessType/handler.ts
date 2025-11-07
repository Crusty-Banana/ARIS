import { Db, ObjectId } from "mongodb";
import {
  GetBusinessType$Params,
  GetAllergens$Params,
  LocalizedAllergen,
  LocalizedSymptom,
  GetUsers$Params,
  GetPAP$Params,
  GetSymptoms$Params,
  GetRecommendations$Params,
  GetActionPlans$Params,
  LocalizedActionPlan,
} from "./typing";
import {
  ActionPlan,
  Allergen,
  BriefAllergen,
  BusisnessTypeCollection,
  PAP,
  Recommendation,
  Symptom,
  User,
} from "@/modules/business-types";
import { metadata } from "@/app/layout";

async function handler$GetBusinessType(
  db: Db,
  params: GetBusinessType$Params,
  collectionName: string
) {
  const { ids, limit, offset, lang, filters } = params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mongoFilter: any = { ...filters };
  if (mongoFilter?._id?.$nin && Array.isArray(mongoFilter._id.$nin)) {
    mongoFilter._id.$nin = mongoFilter._id.$nin.map((id: string) =>
      ObjectId.createFromHexString(id)
    );
  }

  const filterTerm =
    ids || filters
      ? [
          {
            $match: {
              ...(ids
                ? {
                    _id: {
                      $in: ids.map((id) => ObjectId.createFromHexString(id)),
                    },
                  }
                : {}),
              ...(mongoFilter ? mongoFilter : {}),
            },
          },
        ]
      : [];

  const pagingTerm = [
    ...(offset ? [{ $skip: offset }] : []),
    { $limit: limit || 1000 },
  ];

  const docs = await db
    .collection(collectionName)
    .aggregate([...filterTerm, ...pagingTerm])
    .toArray();

  return { docs, lang };
}

export async function handler$GetUsers(db: Db, params: GetUsers$Params) {
  const { docs } = await handler$GetBusinessType(
    db,
    params,
    BusisnessTypeCollection.users
  );

  const parsedDocs = docs.map((doc) => {
    return User.parse({
      ...doc,
      id: doc._id.toHexString(),
    });
  });

  return { result: parsedDocs };
}

export async function handler$GetAllergens(
  db: Db,
  params: GetAllergens$Params
) {
  const {
    ids,
    limit = 5,
    offset = 0,
    lang,
    filters,
    name,
    type,
    sort,
  } = params;

  const localize = lang === "vi" || lang === "en";
  const langKey = localize ? lang : "en"; // Default to "en" if not specified

  // match stage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const $match: any = { ...filters };
  if ($match?._id?.$nin && Array.isArray($match._id.$nin)) {
    $match._id.$nin = $match._id.$nin.map((id: string) =>
      ObjectId.createFromHexString(id)
    );
  }
  if (ids) {
    $match._id = {
      $in: ids.map((id: string) => ObjectId.createFromHexString(id)),
    };
  }
  if (type) {
    $match.type = type;
  }
  if (name) {
    $match[`name.${langKey}`] = { $regex: name, $options: "i" };
  }

  // sort stage
  const $sort: any = {};
  $sort[`name.${langKey}`] = sort === "asc" ? 1 : -1;

  // unset stage
  const $unset = ["description", "isWholeAllergen", "crossSensitivityId"];

  // facet stage (pagination)
  const $facet = {
    data: [{ $sort }, { $skip: offset }, { $limit: limit }, { $unset }],
    metadata: [{ $count: "totalCount" }],
  };

  const result = await db
    .collection(BusisnessTypeCollection.allergens)
    .aggregate([{ $match }, { $facet }])
    .toArray();

  const docs = result[0].data;
  const total = result[0].metadata[0]?.totalCount || 0;

  const parsedDocs = docs.map((doc: any) =>
    BriefAllergen.parse({ ...doc, id: doc._id.toHexString() })
  );

  return { result: parsedDocs, total };
}

export async function handler$GetPAPs(db: Db, params: GetPAP$Params) {
  const { docs } = await handler$GetBusinessType(
    db,
    params,
    BusisnessTypeCollection.paps
  );

  const parsedDocs = docs.map((doc) => {
    return PAP.parse({
      ...doc,
      id: doc._id.toHexString(),
    });
  });

  return { result: parsedDocs };
}

export async function handler$GetSymptoms(db: Db, params: GetSymptoms$Params) {
  const { docs, lang } = await handler$GetBusinessType(
    db,
    params,
    BusisnessTypeCollection.symptoms
  );

  if (lang !== "vi" && lang !== "en") {
    const parsedDocs = docs.map((doc) => {
      return Symptom.parse({
        ...doc,
        id: doc._id.toHexString(),
      });
    });

    return { result: parsedDocs };
  }

  const parsedDocs = docs.map((doc) => {
    return LocalizedSymptom.parse({
      ...doc,
      id: doc._id.toHexString(),
      name: doc.name[lang],
      description: doc.description[lang],
    });
  });
  return { result: parsedDocs };
}

export async function handler$GetRecommendations(
  db: Db,
  params: GetRecommendations$Params
) {
  const { docs } = await handler$GetBusinessType(
    db,
    params,
    BusisnessTypeCollection.recommendations
  );

  const parsedDocs = docs.map((doc) => {
    return Recommendation.parse({
      ...doc,
      id: doc._id.toHexString(),
    });
  });

  return { result: parsedDocs };
}

export async function handler$GetActionPlans(
  db: Db,
  params: GetActionPlans$Params
) {
  const { docs, lang } = await handler$GetBusinessType(
    db,
    params,
    BusisnessTypeCollection.actionPlans
  );

  if (lang !== "vi" && lang !== "en") {
    const parsedDocs = docs.map((doc) => {
      return ActionPlan.parse({
        ...doc,
        id: doc._id.toHexString(),
      });
    });

    return { result: parsedDocs };
  }

  const parsedDocs = docs.map((doc) => {
    return LocalizedActionPlan.parse({
      ...doc,
      id: doc._id.toHexString(),
      text: doc.text[lang],
    });
  });
  return { result: parsedDocs };
}
