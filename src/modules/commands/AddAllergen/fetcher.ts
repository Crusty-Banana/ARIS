import { AddAllergen$Params } from "./typing";

export async function httpPost$AddAllergen(
    url: string,
    params: AddAllergen$Params
) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });
    return response;
}
