import { Db, ObjectId } from "mongodb";
import { AddPAPWithUserId$Params } from "./typing";

export async function handler$AddPAPWithUserId(
  db: Db,
  params: AddPAPWithUserId$Params
) {
  const { userId } = params;
  await db.collection("paps").insertOne({
    userId: new ObjectId(userId),
    publicId: new ObjectId(),
    allowPublic: true,
    gender: "",
    doB: null,
    underlyingMedCon: [],
    allergens: [],
  });
}
