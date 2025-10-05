import { Db, ObjectId } from "mongodb";
import { DeleteBusinessType$Params } from "./typing";
import { BusisnessTypeCollection } from "@/modules/business-types";

async function handler$DeleteBusinessType(
  db: Db,
  params: DeleteBusinessType$Params,
  collectionName: string
) {
  const { id } = params;
  const result = await db
    .collection(collectionName)
    .deleteOne({ _id: ObjectId.createFromHexString(id) });
  return { result: result.deletedCount };
}

export async function handler$DeleteUser(
  db: Db,
  params: DeleteBusinessType$Params
) {
  return handler$DeleteBusinessType(db, params, BusisnessTypeCollection.users);
}

export async function handler$DeleteAllergen(
  db: Db,
  params: DeleteBusinessType$Params
) {
  return handler$DeleteBusinessType(
    db,
    params,
    BusisnessTypeCollection.allergens
  );
}

export async function handler$DeletePAP(
  db: Db,
  params: DeleteBusinessType$Params
) {
  return handler$DeleteBusinessType(db, params, BusisnessTypeCollection.paps);
}

export async function handler$DeleteSymptom(
  db: Db,
  params: DeleteBusinessType$Params
) {
  return handler$DeleteBusinessType(
    db,
    params,
    BusisnessTypeCollection.symptoms
  );
}

export async function handler$DeleteRecommendation(
  db: Db,
  params: DeleteBusinessType$Params
) {
  return handler$DeleteBusinessType(
    db,
    params,
    BusisnessTypeCollection.recommendations
  );
}
