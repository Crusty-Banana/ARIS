import { UpdateSymptom$Result, UpdateSymptomFetcher$Params } from "./typing";

export async function httpPut$UpdateSymptom(
    url: string,
    params: UpdateSymptomFetcher$Params
) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });
    const text = await response.text();
    const data = JSON.parse(text);
    const result = UpdateSymptom$Result.parse({
        success: response.ok,
        ...data
    });
    return result;
}
