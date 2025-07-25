import { UpdateAllergen$Result, UpdateAllergenFetcher$Params } from "./typing";

export async function httpPut$UpdateAllergen(
    url: string,
    params: UpdateAllergenFetcher$Params
) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });
    const text = await response.text();
    const data = JSON.parse(text);
    const result = UpdateAllergen$Result.parse(data);
    return result;
}
