import { DeleteAllergen$Result } from "./typing";

export async function httpDelete$DeleteAllergen(
    url: string
) {
    const response = await fetch(url, {
        method: 'DELETE'
    });
    const text = await response.text();
    const data = JSON.parse(text);
    const result = DeleteAllergen$Result.parse(data);
    return result;
}
