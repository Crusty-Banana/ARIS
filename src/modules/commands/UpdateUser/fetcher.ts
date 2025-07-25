import { UpdateUserFetcher$Params, UpdateUser$Result } from "./typing";

export async function httpPut$UpdateUser(
    url: string,
    params: UpdateUserFetcher$Params
) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });
    const text = await response.text();
    const data = JSON.parse(text);
    const result = UpdateUser$Result.parse(data);
    return result;
}
