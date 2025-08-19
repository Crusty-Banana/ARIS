import { Db, ObjectId } from "mongodb";
import { UpdateProfileWithUserId$Params } from "./typing";
import { BusisnessTypeCollection } from "@/modules/business-types";
import { UserProfilePAP, UserProfileUser } from "../GetProfileWithUserId/typing";

export async function handler$UpdateProfileWithUserId(
  db: Db,
  params: UpdateProfileWithUserId$Params
) {
  const PAPData = UserProfilePAP.partial().parse(params);
  const userData = UserProfileUser.partial().parse(params);
  const userId = params.userId;
  const PAPResult = await db.collection(BusisnessTypeCollection.paps).updateOne(
    { userId: new ObjectId(userId) },
    { $set: PAPData }
  );

  const userResult = await db.collection(BusisnessTypeCollection.users).updateOne(
    { _id: new ObjectId(userId) },
    { $set: userData }
  );

  return {
    result: {
      PAPModified: PAPResult.modifiedCount,
      userModified: userResult.modifiedCount,
    }
  };
}