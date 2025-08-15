import { Db, ObjectId } from "mongodb";
import { GetBusinessType$Params, LocalizedAllergen, LocalizedAllergy, LocalizedSymptom } from "./typing";
import { Allergen, Allergy, BusisnessTypeCollection, PAP, Recommendation, Symptom, User } from "@/modules/business-types";

async function handler$GetBusinessType(db: Db, params: GetBusinessType$Params, collectionName: string) {
  const { id, limit, offset, lang } = params;

  const filterTerm = id ? [{
    $match: id ? { _id: ObjectId.createFromHexString(id) } : {},
  }] : [];

  const pagingTerm = [
    ...(offset ? [{ $skip: offset }] : []),
    { $limit: limit || 200 },
  ];

  const docs = await db
    .collection(collectionName)
    .aggregate([...filterTerm, ...pagingTerm])
    .toArray();

  return { docs, lang };
}

export async function handler$GetUsers(db: Db, params: GetBusinessType$Params) {
  const { docs } = await handler$GetBusinessType(db, params, BusisnessTypeCollection.users);

  const parsedDocs = docs.map((doc) => {
    return User.parse({
      ...doc,
      id: doc._id.toHexString(),
    });
  });

  return parsedDocs;
}

export async function handler$GetAllergens(db: Db, params: GetBusinessType$Params) {
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

export async function handler$GetAllergies(db: Db, params: GetBusinessType$Params) {
  const { docs, lang } = await handler$GetBusinessType(db, params, BusisnessTypeCollection.allergies);

  if (lang !== "vi" && lang !== "en") {
    const parsedDocs = docs.map((doc) => {
      return Allergy.parse({
        ...doc,
        id: doc._id.toHexString(),
      });
    });

    return { result: parsedDocs };
  }

  const parsedDocs = docs.map((doc) => {
    return LocalizedAllergy.parse({
      ...doc,
      id: doc._id.toHexString(),
      name: doc.name[lang],
    });
  });
  return { result: parsedDocs };
}

export async function handler$GetPAPs(db: Db, params: GetBusinessType$Params) {
  const { docs } = await handler$GetBusinessType(db, params, BusisnessTypeCollection.paps);

  const parsedDocs = docs.map((doc) => {
    return PAP.parse({
      ...doc,
      id: doc._id.toHexString(),
    });
  });

  return parsedDocs;
}

export async function handler$GetSymptoms(db: Db, params: GetBusinessType$Params) {
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
      treatment: doc.treatment[lang],
    });
  });
  return { result: parsedDocs };
}

export async function handler$GetRecommendations(db: Db, params: GetBusinessType$Params) {
  const { docs } = await handler$GetBusinessType(db, params, BusisnessTypeCollection.recommendations);

  const parsedDocs = docs.map((doc) => {
    return Recommendation.parse({
      ...doc,
      id: doc._id.toHexString(),
    });
  });

  return parsedDocs;
}