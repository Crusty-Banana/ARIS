import { FetcherResult, User } from "@/modules/business-types";
import { z } from "zod";

export const PasswordChangeWithUserIdSchema = User.pick({ id: true, password: true }).extend({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
})
export type PasswordChangeWithUserIdSchema = z.infer<typeof PasswordChangeWithUserIdSchema>

export const PasswordChangeWithUserId$Params = PasswordChangeWithUserIdSchema
export type PasswordChangeWithUserId$Params = z.infer<typeof PasswordChangeWithUserId$Params>

export const PasswordChange$Result = FetcherResult.extend({
    result: z.boolean(),
})
export type PasswordChange$Result = z.infer<typeof PasswordChange$Result>