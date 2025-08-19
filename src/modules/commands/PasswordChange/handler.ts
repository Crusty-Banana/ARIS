import { Db, ObjectId } from "mongodb";
import { PasswordChangeWithUserId$Params } from "./typing";
import { BusisnessTypeCollection } from "@/modules/business-types";
import { hash, compare } from "bcryptjs"
export async function handler$PasswordChangeWithUserId(
    db: Db,
    params: PasswordChangeWithUserId$Params
) {
    const { id: userId, password, newPassword } = params;
    const user = await db.collection(BusisnessTypeCollection.users).findOne({ _id: new ObjectId(userId) });
    if (!user) {
        return { result: false };
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
        return { result: false };
    }
    const newHashedPassword = await hash(newPassword, 10);
    await db.collection(BusisnessTypeCollection.users).updateOne({ _id: new ObjectId(userId) }, { $set: { password: newHashedPassword } });
    return { result: true }
}