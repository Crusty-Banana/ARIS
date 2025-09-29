import { GetPAPWithUserId$Result } from "./typing";

export async function httpGet$GetPAPWithUserId(url: string) {
  const response = await fetch(url);
  const text = await response.text();
  const data = JSON.parse(text);
  const result = GetPAPWithUserId$Result.parse({
    success: response.ok,
    ...data,
  });
  return result;
}
