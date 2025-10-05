import {
  UpdatePAPWithUserIdFetcher$Params,
  UpdatePAPWithUserId$Result,
} from "./typing";

export async function httpPut$UpdatePAPWithUserId(
  url: string,
  params: UpdatePAPWithUserIdFetcher$Params
) {
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const text = await response.text();
  const data = JSON.parse(text);
  const result = UpdatePAPWithUserId$Result.parse({
    success: response.ok,
    ...data,
  });
  return result;
}
