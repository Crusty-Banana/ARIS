import { UpdatePAPFetcher$Params, UpdatePAP$Result } from "./typing";

export async function httpPut$UpdatePAP(
    url: string,
    params: UpdatePAPFetcher$Params
) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });
    const text = await response.text();
    const data = JSON.parse(text);
    const result = UpdatePAP$Result.parse({
        success: response.ok,
        ...data
    });
    return result;
}
