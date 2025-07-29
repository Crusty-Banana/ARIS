import { GetCrossAllergenFromAllergenID$Result } from "./typing";

export async function httpGet$GetCrossAllergenFromAllergenID(
    url: string
) {
    const response = await fetch(url);
    const text = await response.text();
    const data = JSON.parse(text);
    const result = GetCrossAllergenFromAllergenID$Result.parse({
        success: response.ok,
        ...data
    });
    return result;
}
