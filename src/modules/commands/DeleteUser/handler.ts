import { Db, ObjectId, MongoClient } from "mongodb";
import { DeleteUser$Params } from "./typing";

export async function handler$DeleteUser(
         db: Db,
         client: MongoClient, // Add the MongoClient as a parameter
         params: DeleteUser$Params
    ) {
         const { id } = params;
         const userId = new ObjectId(id);

         // Use the client to start a session for the transaction
         const session = client.startSession();
         try {
              session.startTransaction();

              // 1. Delete the user's PAP record
              await db.collection('paps').deleteOne({ userId }, { session });

              // 2. Delete the user
              const result = await db.collection('users').deleteOne({ _id: userId }, { session });

              await session.commitTransaction();
              return result;
         } catch (error) {
               await session.abortTransaction();
               throw new Error("Failed to delete user and associated data", { cause: error });
         } finally {
              session.endSession();
         }
}