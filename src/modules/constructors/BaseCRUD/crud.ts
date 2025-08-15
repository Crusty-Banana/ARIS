import { z } from "zod";
import { createAddHandler, createDeleteHandler, createGetHandler, createUpdateHandler } from "./handler";
import { createAddFetcher, createDeleteFetcher, createGetFetcher, createUpdateFetcher } from "./fetcher";

export function createCRUD<BusinessType extends z.AnyZodObject>(BusinessType: BusinessType, collectionName: string) {
  const { addParams, addHandler } = createAddHandler<BusinessType>(BusinessType, collectionName);
  const { getParams, DisplayBusinessType, getHandler } = createGetHandler<BusinessType>(BusinessType, collectionName);
  const { updateParams, updateHandler } = createUpdateHandler<BusinessType>(BusinessType, collectionName);
  const { deleteParams, deleteHandler } = createDeleteHandler(collectionName);
  const { addResult, addFetcher } = createAddFetcher(addParams);
  const { getResult, getFetcher } = createGetFetcher(getParams, BusinessType, DisplayBusinessType);
  const { updateResult, updateFetcher } = createUpdateFetcher(updateParams);
  const { deleteResult, deleteFetcher } = createDeleteFetcher();

  return {
    DisplayBusinessType,
    addParams,
    getParams,
    updateParams,
    deleteParams,
    addResult,
    getResult,
    updateResult,
    deleteResult,
    addHandler,
    getHandler,
    updateHandler,
    deleteHandler,
    addFetcher,
    getFetcher,
    updateFetcher,
    deleteFetcher,
  }
}