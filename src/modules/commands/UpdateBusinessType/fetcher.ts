import { FetcherResult } from "@/modules/business-types";
import { UpdateAllergenFetcher$Params, UpdatePAPFetcher$Params, UpdateRecommendationFetcher$Params, UpdateSymptomFetcher$Params, UpdateUserFetcher$Params } from "./typing";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function httpPut$UpdateBusinessType(url: string, params: any) {
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const text = await response.text();
  const data = JSON.parse(text);
  const result = FetcherResult.parse({
    success: response.ok,
    ...data
  });
  return result;
}

export async function httpPut$UpdateUser(url: string, params: UpdateUserFetcher$Params) {
  return await httpPut$UpdateBusinessType(url, params);
}

export async function httpPut$UpdateAllergen(url: string, params: UpdateAllergenFetcher$Params) {
  return await httpPut$UpdateBusinessType(url, params);
}

export async function httpPut$UpdatePAP(url: string, params: UpdatePAPFetcher$Params) {
  return await httpPut$UpdateBusinessType(url, params);
}

export async function httpPut$UpdateSymptom(url: string, params: UpdateSymptomFetcher$Params) {
  return await httpPut$UpdateBusinessType(url, params);
}

export async function httpPut$UpdateRecommendation(url: string, params: UpdateRecommendationFetcher$Params) {
  return await httpPut$UpdateBusinessType(url, params);
}