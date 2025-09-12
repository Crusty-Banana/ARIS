import { FetcherResult } from "@/modules/business-types";

async function httpDelete$DeleteBusinessType(url: string) {
  const response = await fetch(url, {
    method: 'DELETE'
  });
  const text = await response.text();
  const data = JSON.parse(text);
  const result = FetcherResult.parse({
    success: response.ok,
    ...data
  });
  return result;
}

export async function httpDelete$DeleteUser(url: string) {
  return httpDelete$DeleteBusinessType(url);
}

export async function httpDelete$DeleteAllergen(url: string) {
  return httpDelete$DeleteBusinessType(url);
}

export async function httpDelete$DeletePap(url: string) {
  return httpDelete$DeleteBusinessType(url);
}

export async function httpDelete$DeleteSymptom(url: string) {
  return httpDelete$DeleteBusinessType(url);
}

export async function httpDelete$DeleteRecommendation(url: string) {
  return httpDelete$DeleteBusinessType(url);
}