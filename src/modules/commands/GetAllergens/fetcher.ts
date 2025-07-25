import { GetAllergens$Params, GetAllergens$Result } from "./typing";

export async function httpGet$GetAllergens(
    url: string,
    params: GetAllergens$Params
) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value) {
            searchParams.append(key, value.toString());
        }
    });
    const response = await fetch(url + "?" + searchParams.toString());
    const text = await response.text();
    const data = JSON.parse(text);
    const result = GetAllergens$Result.parse({ allergens: data });
    return result;
}
