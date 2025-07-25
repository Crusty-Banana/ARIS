import { GetPublicPAP$Result } from "./typing";

export async function httpGet$GetPublicPAP(
    url: string
) {
    const response = await fetch(url);
    const text = await response.text();
    const data = JSON.parse(text);
    const result = GetPublicPAP$Result.parse(data);
    return result;
}