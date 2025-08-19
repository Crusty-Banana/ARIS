import { RequestReset$Params, RequestReset$Result, ResetPassword$Params, ResetPassword$Result } from "./typing";

export async function httpPost$RequestReset(
    url: string,
    params: RequestReset$Params
): Promise<RequestReset$Result> {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || "Failed to request password reset." };
        }
        return { success: true, message: data.message };
    } catch (error) {
        console.error("API error:", error);
        return { success: false, message: "An unexpected error occurred." };
    }
}


export async function httpPost$ResetPassword(
    url: string,
    params: ResetPassword$Params
): Promise<ResetPassword$Result> {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || "Failed to reset password." };
        }
        return { success: true, message: data.message };
    } catch (error) {
        console.error("API error:", error);
        return { success: false, message: "An unexpected error occurred." };
    }
}

export async function httpGet$ResetPasswordToken(
    url: string,
): Promise<ResetPassword$Result> {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || "Bad Token." };
        }
        return { success: true, message: data.message };
    } catch (error) {
        console.error("API error:", error);
        return { success: false, message: "An unexpected error occurred." };
    }
}