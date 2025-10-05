import { z } from "zod";
import { FetcherResult } from "@/modules/business-types";

const DeleteUser$Result = FetcherResult.extend({
  acknowledged: z.boolean(),
});
export type DeleteUser$Result = z.infer<typeof DeleteUser$Result>;

export async function httpDelete$DeleteUser(
  url: string
): Promise<DeleteUser$Result> {
  const response = await fetch(url, {
    method: "DELETE",
  });
  const text = await response.text();
  const data = JSON.parse(text);
  const result = DeleteUser$Result.parse({
    success: response.ok,
    ...data,
  });
  return result;
}
