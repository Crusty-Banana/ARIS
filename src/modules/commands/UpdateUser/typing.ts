import { ObjectIdAsHexString } from "@/modules/business-types";
import z from "zod";

export const UpdateUser$Params = z.object({
    id: ObjectIdAsHexString,
    firstName: z
        .string()
        .min(1, "First name is required")
        .regex(/^[a-zA-Z]+$/, {
            message: "Name must contain only alphabetical characters.",
        })
        .optional(),
    lastName: z
        .string()
        .min(1, "First name is required")
        .regex(/^[a-zA-Z]+$/, {
            message: "Name must contain only alphabetical characters.",
        })
        .optional(),
});

export type UpdateUser$Params = z.infer<typeof UpdateUser$Params>;

export const UpdateUserFetcher$Params = UpdateUser$Params.omit({ id: true });
export type UpdateUserFetcher$Params = z.infer<typeof UpdateUserFetcher$Params>;

export const UpdateUser$Result = z.object({
    message: z.string(),
});
export type UpdateUser$Result = z.infer<typeof UpdateUser$Result>;