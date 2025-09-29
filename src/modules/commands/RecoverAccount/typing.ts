import { z } from "zod";

// Schema for resetting the password with a token
const ResetPassword = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  token: z.string().min(1, "Token is required"),
});
type ResetPassword = z.infer<typeof ResetPassword>;

// Schema for requesting a password reset
const RequestPasswordReset = z.object({
  email: z.string().email("Invalid email address"),
});
type RequestPasswordReset = z.infer<typeof RequestPasswordReset>;

// For requesting a reset link
export const RequestReset$Params = RequestPasswordReset;
export type RequestReset$Params = z.infer<typeof RequestReset$Params>;

export const RequestReset$Result = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type RequestReset$Result = z.infer<typeof RequestReset$Result>;

// For submitting a new password with a token
export const ResetPassword$Params = ResetPassword;
export type ResetPassword$Params = z.infer<typeof ResetPassword$Params>;

export const ResetPassword$Result = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type ResetPassword$Result = z.infer<typeof ResetPassword$Result>;
