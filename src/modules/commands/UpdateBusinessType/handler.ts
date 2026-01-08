import { Db, ObjectId } from "mongodb";
import { UpdateActionPlan$Params, UpdateAllergen$Params, UpdatePAP$Params, UpdateRecommendation$Params, UpdateSymptom$Params, UpdateUser$Params } from "./typing";
import { BusisnessTypeCollection } from "@/modules/business-types";

async function handler$UpdateBusinessType(
  db: Db,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any,
  collectionName: string
) {
  const { id, ...documentData } = params;
  const result = await db
    .collection(collectionName)
    .updateOne(
      { _id: ObjectId.createFromHexString(id) },
      { $set: documentData }
    );

  return { result: result.modifiedCount };
}

export async function handler$UpdateUser(db: Db, params: UpdateUser$Params) {
  return await handler$UpdateBusinessType(
    db,
    params,
    BusisnessTypeCollection.users
  );
}

export async function handler$UpdateAllergen(
  db: Db,
  params: UpdateAllergen$Params
) {
  return await handler$UpdateBusinessType(
    db,
    params,
    BusisnessTypeCollection.allergens
  );
}

export async function handler$UpdatePAP(db: Db, params: UpdatePAP$Params) {
  return await handler$UpdateBusinessType(
    db,
    params,
    BusisnessTypeCollection.paps
  );
}

export async function handler$UpdateSymptom(db: Db, params: UpdateSymptom$Params) {
  return await handler$UpdateBusinessType(
    db,
    params,
    BusisnessTypeCollection.symptoms
  );
}

export async function handler$UpdateActionPlan(db: Db, params: UpdateActionPlan$Params) {
  return await handler$UpdateBusinessType(
    db,
    params,
    BusisnessTypeCollection.actionPlans
  );
}

export async function handler$UpdateRecommendation(
  db: Db,
  params: UpdateRecommendation$Params
) {
  return await handler$UpdateBusinessType(
    db,
    params,
    BusisnessTypeCollection.recommendations
  );
}
