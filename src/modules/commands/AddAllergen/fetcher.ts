import { AddAllergen$Params, AddAllergen$Result } from "./typing";

export async function httpPost$AddAllergen(
    url: string,
    params: AddAllergen$Params
) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });
    const text = await response.text();
    const data = JSON.parse(text);
    const result = AddAllergen$Result.parse({
        success: response.ok,
        ...data
    });
    return result;
}
