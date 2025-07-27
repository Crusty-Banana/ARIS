import { DeleteAllergy$Result } from "./typing";

export async function httpDelete$DeleteAllergy(
    url: string
) {
    const response = await fetch(url, {
        method: 'DELETE'
    });
    const text = await response.text();
    const data = JSON.parse(text);
    const result = DeleteAllergy$Result.parse({
        success: response.ok,
        ...data
    });
    return result;
}
