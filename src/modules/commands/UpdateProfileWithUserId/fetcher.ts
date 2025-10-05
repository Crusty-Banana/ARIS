import {
  UpdateProfileWithUserIdFetcher$Params,
  UpdateProfileWithUserId$Result,
} from "./typing";

export async function httpPut$UpdateProfileWithUserId(
  url: string,
  params: UpdateProfileWithUserIdFetcher$Params
) {
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const text = await response.text();
  const data = JSON.parse(text);
  const result = UpdateProfileWithUserId$Result.parse({
    success: response.ok,
    ...data,
  });
  return result;
}
