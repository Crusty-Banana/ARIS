import {
  GetActionPlans$Result,
  GetActionPlansLocalized$Result,
  GetAllergens$Params,
  GetAllergens$Result,
  GetAllergensLocalized$Result,
  GetBriefAllergens$Result,
  GetBusinessType$Params,
  GetPAPs$Result,
  GetRecommendations$Result,
  GetSymptoms$Result,
  GetSymptomsLocalized$Result,
  GetUsers$Result,
} from "./typing";

async function httpGet$GetBusinessType(
  url: string,
  params: GetBusinessType$Params
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
  return { response, data };
}

export async function httpGet$GetUsers(
  url: string,
  params: GetBusinessType$Params
) {
  const { response, data } = await httpGet$GetBusinessType(url, params);
  const result = GetUsers$Result.parse({
    success: response.ok,
    ...data,
  });

  return result;
}

export async function httpGet$GetAllergens(
  url: string,
  params: GetAllergens$Params
) {
  const { response, data } = await httpGet$GetBusinessType(url, params);
  const result = GetBriefAllergens$Result.parse({
    success: response.ok,
    ...data,
  });

  return result;
}

export async function httpGet$GetPAPs(
  url: string,
  params: GetBusinessType$Params
) {
  const { response, data } = await httpGet$GetBusinessType(url, params);
  const result = GetPAPs$Result.parse({
    success: response.ok,
    ...data,
  });

  return result;
}

export async function httpGet$GetSymptoms(
  url: string,
  params: GetBusinessType$Params
) {
  const { response, data } = await httpGet$GetBusinessType(url, params);
  const { lang } = params;

  const result =
    lang !== "vi" && lang !== "en"
      ? GetSymptoms$Result.parse({
          success: response.ok,
          ...data,
        })
      : GetSymptomsLocalized$Result.parse({
          success: response.ok,
          ...data,
        });

  return result;
}

export async function httpGet$GetActionPlans(
  url: string,
  params: GetBusinessType$Params
) {
  const { response, data } = await httpGet$GetBusinessType(url, params);
  const { lang } = params;

  const result =
    lang !== "vi" && lang !== "en"
      ? GetActionPlans$Result.parse({
          success: response.ok,
          ...data,
        })
      : GetActionPlansLocalized$Result.parse({
          success: response.ok,
          ...data,
        });

  return result;
}

export async function httpGet$GetRecommendations(
  url: string,
  params: GetBusinessType$Params
) {
  const { response, data } = await httpGet$GetBusinessType(url, params);
  const result = GetRecommendations$Result.parse({
    success: response.ok,
    ...data,
  });

  return result;
}
