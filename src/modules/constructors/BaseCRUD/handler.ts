import { ObjectIdAsHexString } from "@/modules/business-types";
import { Db, ObjectId } from "mongodb";
import { z } from "zod";

export function createAddHandler<BusinessType extends z.AnyZodObject>(BusinessType: BusinessType, collectionName: string) {
  const addParams = BusinessType.omit({ id: true });
  type addParams = z.infer<typeof addParams>;

  return {
    addParams,
    addHandler: async (db: Db, params: addParams) => {
      const { insertedId } = await db.collection(collectionName).insertOne(params);
      return { result: insertedId.toHexString() };
    }
  }
}

export function createGetHandler<BusinessType extends z.AnyZodObject>(BusinessType: BusinessType, collectionName: string) {
  const getParams = z.object({
    id: ObjectIdAsHexString.optional(),
    limit: z.coerce.number().optional(),
    offset: z.coerce.number().optional()
  });
  type getParams = z.infer<typeof getParams>;

  return {
    getParams,
    getHandler: async (db: Db, params: getParams) => {
      const { id, limit, offset } = params;

      const filterTerm = id ? [{
        $match: id ? { _id: ObjectId.createFromHexString(id) } : {},
      }] : [];

      const pagingTerm = [
        ...(offset ? [{ $skip: offset }] : []),
        { $limit: limit || 200 },
      ];

      const docs = await db
        .collection(collectionName)
        .aggregate([...filterTerm, ...pagingTerm])
        .toArray();

      const parsedDocs = docs.map((doc) => {
        return BusinessType.parse({
          id: doc._id.toHexString(),
          ...doc,
        });
      });

      return { result: parsedDocs as BusinessType[] };
    }
  }
}

export function createUpdateHandler<BusinessType extends z.AnyZodObject>(BusinessType: BusinessType, collectionName: string) {
  const updateParams = BusinessType.partial().required({ id: true });
  type updateParams = z.infer<typeof updateParams>;

  return {
    updateParams,
    updateHandler: async (db: Db, params: updateParams) => {
      const { id, ...documentData } = params;
      const result = await db
        .collection(collectionName)
        .updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: documentData });

      return { result: result.modifiedCount };
    }
  }
}

export function createDeleteHandler(collectionName: string) {
  const deleteParams = z.object({
    id: ObjectIdAsHexString,
  });
  type deleteParams = z.infer<typeof deleteParams>;

  return {
    deleteParams,
    deleteHandler: async (db: Db, params: deleteParams) => {
      const { id } = params;
      const result = await db.collection(collectionName).deleteOne({ _id: ObjectId.createFromHexString(id) });
      return { result: result.deletedCount };
    }
  }
}