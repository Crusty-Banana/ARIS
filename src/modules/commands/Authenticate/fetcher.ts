import { Register$Params } from "./typing";

export async function httpPost$Register(
    url: string,
    params: Register$Params
) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });
    return response;
}
