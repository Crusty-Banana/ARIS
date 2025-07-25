import { UpdateAllergy$Result, UpdateAllergyFetcher$Params } from "./typing";

export async function httpPut$UpdateAllergy(
    url: string,
    params: UpdateAllergyFetcher$Params
) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });
    const text = await response.text();
    const data = JSON.parse(text);
    const result = UpdateAllergy$Result.parse(data);
    return result;
}
