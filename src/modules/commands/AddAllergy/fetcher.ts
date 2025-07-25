import { AddAllergy$Params, AddAllergy$Result } from "./typing";

export async function httpPost$AddAllergy(
    url: string,
    params: AddAllergy$Params
) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });
    const text = await response.text();
    const data = JSON.parse(text);
    const result = AddAllergy$Result.parse(data);
    return result;
}
