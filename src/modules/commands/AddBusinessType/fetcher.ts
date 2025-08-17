import { AddAllergen$Params, AddAllergy$Params, AddBusinessType$Result, AddPAP$Params, AddRecommendation$Params, AddSymptom$Params, AddUser$Params } from "./typing";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function httpPost$AddBusinessType(url: string, params: any) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const text = await response.text();
  const data = JSON.parse(text);
  const result = AddBusinessType$Result.parse({
    success: response.ok,
    ...data
  });
  return result;
}

export async function httpPost$AddUser(url: string, params: AddUser$Params) {
  return await httpPost$AddBusinessType(url, params);
}

export async function httpPost$AddAllergen(url: string, params: AddAllergen$Params) {
  return await httpPost$AddBusinessType(url, params);
}

export async function httpPost$AddAllergy(url: string, params: AddAllergy$Params) {
  return await httpPost$AddBusinessType(url, params);
}

export async function httpPost$AddPAP(url: string, params: AddPAP$Params) {
  return await httpPost$AddBusinessType(url, params);
}

export async function httpPost$AddSymptom(url: string, params: AddSymptom$Params) {
  return await httpPost$AddBusinessType(url, params);
}

export async function httpPost$AddRecommendation(url: string, params: AddRecommendation$Params) {
  return await httpPost$AddBusinessType(url, params);
}