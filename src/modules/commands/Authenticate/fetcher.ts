import { Register$Params, Register$Result } from "./typing";

export async function httpPost$Register(
    url: string,
    params: Register$Params
): Promise<Register$Result> {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        const text = await response.text();
        const data = JSON.parse(text);

        if (!response.ok) {
            return { success: false, message: data.message || "Failed to register user" }
        }

        return { success: true, message: data.message };
    } catch (error) {
        console.error("API error:", error)
        return { success: false, message: "An unexpected error occurred" }
    }
}
