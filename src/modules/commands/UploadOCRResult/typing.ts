import { z } from "zod";

export const OCRUserinput$input = z
  .string()
  .max(49, "Message must be less than 50 characters");
export type OCRUserinput$input = z.infer<typeof OCRUserinput$input>;

export const OCRUserinput$Result = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type OCRUserinput$Result = z.infer<typeof OCRUserinput$Result>;
