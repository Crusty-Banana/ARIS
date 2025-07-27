import { AddSymptom$Params, AddSymptom$Result } from "./typing";

export async function httpPost$AddSymptom(
    url: string,
    params: AddSymptom$Params
) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });
    const text = await response.text();
    const data = JSON.parse(text);
    const result = AddSymptom$Result.parse({ success: true, ...data });
    return result;
}
