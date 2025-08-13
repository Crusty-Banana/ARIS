import { ObjectIdAsHexString } from "@/modules/business-types";
import { z } from "zod";

export function createAddFetcher(addParams: z.AnyZodObject) {
  type addParams = z.infer<typeof addParams>;

  const addResult = z.object({
    success: z.boolean(),
    message: z.string(),
    result: ObjectIdAsHexString.optional(),
  })
  type addResult = z.infer<typeof addResult>;

  return {
    addResult,
    addFetcher: async (url: string, params: addParams) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const text = await response.text();
      const data = JSON.parse(text);
      const result = addResult.parse({
        success: response.ok,
        ...data
      });
      return result;
    }
  }
}

export function createGetFetcher(getParams: z.AnyZodObject, BusinessType: z.AnyZodObject) {
  type getParams = z.infer<typeof getParams>;
  const getResult = z.object({
    success: z.boolean(),
    message: z.string(),
    result: z.array(BusinessType).optional()
  });
  type getResult = z.infer<typeof getResult>;

  return {
    getResult,
    getFetcher: async (url: string, params: getParams) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          searchParams.append(key, value.toString());
        }
      });
      const response = await fetch(url + "?" + searchParams.toString());
      const text = await response.text();
      const data = JSON.parse(text);
      const result = getResult.parse({
        success: response.ok,
        ...data
      });
      return result;
    }
  }
}

export function createUpdateFetcher(updateParams: z.AnyZodObject) {
  const updateFetcherParams = updateParams.omit({ id: true });
  type updateFetcherParams = z.infer<typeof updateFetcherParams>;

  const updateResult = z.object({
    success: z.boolean(),
    message: z.string()
  });
  type updateResult = z.infer<typeof updateResult>;

  return {
    updateFetcherParams,
    updateResult,
    updateFetcher: async (url: string, params: updateFetcherParams) => {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const text = await response.text();
      const data = JSON.parse(text);
      const result = updateResult.parse({
        success: response.ok,
        ...data
      });
      return result;
    }
  }
}

export function createDeleteFetcher() {
  const deleteResult = z.object({
    success: z.boolean(),
    message: z.string()
  });
  type deleteResult = z.infer<typeof deleteResult>;

  return {
    deleteResult,
    deleteFetcher: async (url: string) => {
      const response = await fetch(url, {
        method: 'DELETE'
      });
      const text = await response.text();
      const data = JSON.parse(text);
      const result = deleteResult.parse({
        success: response.ok,
        ...data
      });
      return result;
    }
  }
}
