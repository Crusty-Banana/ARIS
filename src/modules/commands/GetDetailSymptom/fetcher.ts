import { GetDetailSymptom$Params, GetDetailSymptom$Result } from "./typing";

export async function httpGet$GetDetailSymptom(
  url: string,
  params: GetDetailSymptom$Params
) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      if (typeof value === "object" && !Array.isArray(value)) {
        searchParams.append(key, JSON.stringify(value));
      } else if (Array.isArray(value)) {
        searchParams.append(key, value.join(","));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });
  const response = await fetch(url + "?" + searchParams.toString());
  const text = await response.text();
  const data = JSON.parse(text);

  const result = GetDetailSymptom$Result.parse({
    success: response.ok,
    ...data,
  });

  return result;
}
