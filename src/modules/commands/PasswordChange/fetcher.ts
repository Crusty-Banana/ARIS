import { PasswordChange$Result, PasswordChangeWithUserId$Params } from "./typing";
import { z } from "zod"

const PasswordChange$Param = PasswordChangeWithUserId$Params.omit({ id: true })
type PasswordChange$Param = z.infer<typeof PasswordChange$Param>

export async function httpPut$PasswordChange(
    url: string, params: PasswordChange$Param
) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });
    const text = await response.text();
    const data = JSON.parse(text);
    const result = PasswordChange$Result.parse({
        success: response.ok,
        ...data
    });
    return result;

}
