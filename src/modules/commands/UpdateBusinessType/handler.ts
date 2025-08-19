import { Db, ObjectId } from "mongodb";
import { UpdateUser$Params } from "./typing";
import { BusisnessTypeCollection } from "@/modules/business-types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handler$UpdateBusinessType(db: Db, params: any, collectionName: string) {
  const { id, ...documentData } = params;
  const result = await db
    .collection(collectionName)
    .updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: documentData });

  return { result: result.modifiedCount };
}

export async function handler$UpdateUser(db: Db, params: UpdateUser$Params) {
  return await handler$UpdateBusinessType(db, params, BusisnessTypeCollection.users);
}

export async function handler$UpdateAllergen(db: Db, params: UpdateUser$Params) {
  return await handler$UpdateBusinessType(db, params, BusisnessTypeCollection.allergens);
}

export async function handler$UpdateAllergy(db: Db, params: UpdateUser$Params) {
  return await handler$UpdateBusinessType(db, params, BusisnessTypeCollection.allergies);
}

export async function handler$UpdatePAP(db: Db, params: UpdateUser$Params) {
  return await handler$UpdateBusinessType(db, params, BusisnessTypeCollection.paps);
}

export async function handler$UpdateSymptom(db: Db, params: UpdateUser$Params) {
  return await handler$UpdateBusinessType(db, params, BusisnessTypeCollection.symptoms);
}

export async function handler$UpdateRecommendation(db: Db, params: UpdateUser$Params) {
  return await handler$UpdateBusinessType(db, params, BusisnessTypeCollection.recommendations);
}