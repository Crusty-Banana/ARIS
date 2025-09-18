import { Db, ObjectId } from "mongodb";
import {
  GetBusinessType$Params,
  GetAllergens$Params,
  LocalizedAllergen, LocalizedSymptom,
  GetUsers$Params,
  GetPAP$Params,
  GetSymptoms$Params,
  GetRecommendations$Params
} from "./typing";
import { Allergen, BusisnessTypeCollection, PAP, Recommendation, Symptom, User } from "@/modules/business-types";

async function handler$GetBusinessType(db: Db, params: GetBusinessType$Params, collectionName: string) {
  const { ids, limit, offset, lang, filters } = params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mongoFilter: any = { ...filters };
  if (mongoFilter?._id?.$nin && Array.isArray(mongoFilter._id.$nin)) {
    mongoFilter._id.$nin = mongoFilter._id.$nin.map((id: string) => ObjectId.createFromHexString(id));
  }

  const filterTerm = (ids || filters) ? [{
    $match: {
      ...(ids ? { _id: { $in: ids.map((id) => ObjectId.createFromHexString(id)) } } : {}),
      ...(mongoFilter ? mongoFilter : {})
    }
  }] : [];

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
  const { docs } = await handler$GetBusinessType(db, params, BusisnessTypeCollection.users);

  const parsedDocs = docs.map((doc) => {
    return User.parse({
      ...doc,
      id: doc._id.toHexString(),
    });
  });

  return { result: parsedDocs };
}

export async function handler$GetAllergens(db: Db, params: GetAllergens$Params) {
  const { docs, lang } = await handler$GetBusinessType(db, params, BusisnessTypeCollection.allergens);
  if (lang !== "vi" && lang !== "en") {
    const parsedDocs = docs.map((doc) => {
      return Allergen.parse({
        ...doc,
        id: doc._id.toHexString(),
      });
    });

    return { result: parsedDocs };
  }
  const parsedDocs = docs.map((doc) => {
    return LocalizedAllergen.parse({
      ...doc,
      id: doc._id.toHexString(),
      name: doc.name[lang],
      description: doc.description[lang],
      treatment: {
        level_1: doc.treatment.level_1[lang],
        level_2: doc.treatment.level_2[lang],
        level_3: doc.treatment.level_3[lang]
      }
    });
  });
  return { result: parsedDocs };
}


export async function handler$GetPAPs(db: Db, params: GetPAP$Params) {
  const { docs } = await handler$GetBusinessType(db, params, BusisnessTypeCollection.paps);

  const parsedDocs = docs.map((doc) => {
    return PAP.parse({
      ...doc,
      id: doc._id.toHexString(),
    });
  });

  return { result: parsedDocs };
}

export async function handler$GetSymptoms(db: Db, params: GetSymptoms$Params) {
  const { docs, lang } = await handler$GetBusinessType(db, params, BusisnessTypeCollection.symptoms);

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

export async function handler$GetRecommendations(db: Db, params: GetRecommendations$Params) {
  const { docs } = await handler$GetBusinessType(db, params, BusisnessTypeCollection.recommendations);

  const parsedDocs = docs.map((doc) => {
    return Recommendation.parse({
      ...doc,
      id: doc._id.toHexString(),
    });
  });

  return { result: parsedDocs };
}