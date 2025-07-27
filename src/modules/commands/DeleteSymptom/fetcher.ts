import { DeleteSymptom$Result } from "./typing";

export async function httpDelete$DeleteSymptom(
    url: string
) {
    const response = await fetch(url, {
        method: 'DELETE'
    });
    const text = await response.text();
    const data = JSON.parse(text);
    const result = DeleteSymptom$Result.parse({
        success: response.ok,
        ...data
    });
    return result;
}
