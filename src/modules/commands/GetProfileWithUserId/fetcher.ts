import { GetProfileWithUserId$Result } from "./typing";

export async function httpGet$GetProfileWithUserId(
  url: string
) {
  const response = await fetch(url);
  const text = await response.text();
  const data = JSON.parse(text);
  const result = GetProfileWithUserId$Result.parse({
    success: response.ok,
    ...data
  });
  return result;
}