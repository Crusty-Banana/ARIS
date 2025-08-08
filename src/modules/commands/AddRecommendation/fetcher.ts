import { AddRecommendation$Params, AddRecommendation$Result } from "./typing";

export async function httpPost$AddRecommendation(
    url: string,
    params: AddRecommendation$Params
) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });
    const text = await response.text();
    const data = JSON.parse(text);
    const result = AddRecommendation$Result.parse({
        success: response.ok,
        ...data
    });
    return result;
}