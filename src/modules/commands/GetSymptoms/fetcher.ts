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
    const result = GetSymptoms$Result.parse({ symptoms: data });
    return result;
}
