import { Db, ObjectId } from "mongodb";
import { UpdatePAPWithUserId$Params } from "./typing";

export async function handler$UpdatePAPWithUserId(
  db: Db,
  params: UpdatePAPWithUserId$Params
) {
  const { userId, ...PAPdata } = params;
  const result = await db
    .collection("paps")
    .updateOne({ userId: new ObjectId(userId) }, { $set: PAPdata });
  return { result: result.modifiedCount };
}
