import { ObjectIdAsHexString, PAP } from "@/modules/business-types";
import z from "zod";

// export const UpdatePAP$Params = z.object({
//     userId: ObjectIdAsHexString,
//     allowPublic: z.boolean().optional(),
//     gender: z.enum(["male", "female", "other"]).nullable().optional(),
//     doB: z.date().nullable().optional(),
//     allergens: z
//         .array(
//             z.object({
//                 allergenId: ObjectIdAsHexString,
//                 degree: z.number().min(1).max(5),
//             }),
//         )
//         .optional(),

// });

export const UpdatePAP$Params = PAP.omit({id: true}).partial()

export type UpdatePAP$Params = z.infer<typeof UpdatePAP$Params>;

export const UpdatePAPFetcher$Params = UpdatePAP$Params.omit({
    userId: true,
});
export type UpdatePAPFetcher$Params = z.infer<typeof UpdatePAPFetcher$Params>;

export const UpdatePAP$Result = z.object({
    message: z.string(),
});
export type UpdatePAP$Result = z.infer<typeof UpdatePAP$Result>;