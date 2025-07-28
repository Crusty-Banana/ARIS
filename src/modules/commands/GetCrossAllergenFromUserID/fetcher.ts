import { GetCrossAllergenFromUserID$Result } from "./typing";

export async function httpGet$GetCrossAllergenFromUserID(
    url: string
) {
    const response = await fetch(url);
    const text = await response.text();
    const data = JSON.parse(text);
    const result = GetCrossAllergenFromUserID$Result.parse({
        success: response.ok,
        ...data
    });
    return result;
}
