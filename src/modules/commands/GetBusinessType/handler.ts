import { Db, ObjectId } from "mongodb";
import { GetBusinessType$Params, 
  GetAllergens$Params,
  GetRecommendations$Params,
  GetUsers$Params,
  GetPAP$Params,
  GetSymptoms$Params,
  LocalizedAllergen, LocalizedSymptom } from "./typing";
import { Allergen, BusisnessTypeCollection, PAP, Recommendation, Symptom, User } from "@/modules/business-types";

async function handler$GetBusinessType(db: Db, params: GetBusinessType$Params, collectionName: string) {
  const { id, limit, offset, lang, ...filters } = params;

  const match: Record<string, unknown> = {};

  if (id) {
    if (Array.isArray(id)) {
      match._id = { $in: id.map((hex) => ObjectId.createFromHexString(hex)) };
    } else {
      match._id = ObjectId.createFromHexString(id);
    }
  }

  for (const [key, value] of Object.entries(filters)) {
    if (key.endsWith("Id")) {
      match[key] = { $in: value.map((hex: string) => ObjectId.createFromHexString(hex)) };
    } else {
      match[key] = value;
    }
  }

  const filterTerm = Object.keys(match).length > 0 ? [{ $match: match }] : [];

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