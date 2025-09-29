import { Db } from "mongodb";
import {
  AddAllergen$Params,
  AddPAP$Params,
  AddRecommendation$Params,
  AddSymptom$Params,
  AddUser$Params,
} from "./typing";
import { BusisnessTypeCollection } from "@/modules/business-types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handler$AddBusinessType(
  db: Db,
  params: any,
  collectionName: string
) {
  const { insertedId } = await db.collection(collectionName).insertOne(params);
  return { result: insertedId.toHexString() };
}

export async function handler$AddUser(db: Db, params: AddUser$Params) {
  return await handler$AddBusinessType(
    db,
    params,
    BusisnessTypeCollection.users
  );
}

export async function handler$AddAllergen(db: Db, params: AddAllergen$Params) {
  return await handler$AddBusinessType(
    db,
    params,
    BusisnessTypeCollection.allergens
  );
}

export async function handler$AddPAP(db: Db, params: AddPAP$Params) {
  return await handler$AddBusinessType(
    db,
    params,
    BusisnessTypeCollection.paps
  );
}

export async function handler$AddSymptom(db: Db, params: AddSymptom$Params) {
  return await handler$AddBusinessType(
    db,
    params,
    BusisnessTypeCollection.symptoms
  );
}

export async function handler$AddRecommendation(
  db: Db,
  params: AddRecommendation$Params
) {
  return await handler$AddBusinessType(
    db,
    params,
    BusisnessTypeCollection.recommendations
  );
}
