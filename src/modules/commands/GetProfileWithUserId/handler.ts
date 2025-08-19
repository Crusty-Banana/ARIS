import { Db, ObjectId } from "mongodb";
import { GetProfileWithUserId$Params, UserProfile } from "./typing";
import { BusisnessTypeCollection } from "@/modules/business-types";

export async function handler$GetProfileWithUserId(
  db: Db,
  params: GetProfileWithUserId$Params
) {
  const { userId } = params;
  const userPAP = await db.collection(BusisnessTypeCollection.paps).findOne({ userId: new ObjectId(userId) });
  const user = await db.collection(BusisnessTypeCollection.users).findOne({ _id: new ObjectId(userId) });
  if (!user || !userPAP) {
    return { result: userPAP };
  }

  const userProfile = UserProfile.parse({
    ...user,
    ...userPAP,
    userId,
    publicId: userPAP.publicId.toHexString(),
  })
  return { result: userProfile }
}