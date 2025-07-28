import { GetAllergies$Params, GetAllergies$Result } from "./typing";

export async function httpGet$GetAllergies(
    url: string,
    params: GetAllergies$Params
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
    const result = GetAllergies$Result.parse({
        success: response.ok,
        ...data
    });
    return result;
}
