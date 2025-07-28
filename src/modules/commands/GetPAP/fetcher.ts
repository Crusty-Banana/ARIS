import { GetPAP$Result } from "./typing";

export async function httpGet$GetPAP(
    url: string
) {
    const response = await fetch(url);
    const text = await response.text();
    const data = JSON.parse(text);
    const result = GetPAP$Result.parse({
        success: response.ok,
        ...data
    });
    return result;
}