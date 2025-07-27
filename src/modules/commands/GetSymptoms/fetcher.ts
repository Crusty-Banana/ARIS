import { GetSymptoms$Params, GetSymptoms$Result } from "./typing";

export async function httpGet$GetSymptoms(
    url: string,
    params: GetSymptoms$Params
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
    if (!response.ok) {
        return GetSymptoms$Result.parse({
            success: false,
            ...data
        });
    }
    const result = GetSymptoms$Result.parse({
        success: true,
        ...data
    });
    return result;
}
