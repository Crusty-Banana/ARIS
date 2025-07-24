import { z } from "zod";

export const ObjectIdAsHexString = z.string().regex(/^[0-9a-f]{24}$/);
export type ObjectIdAsHexString = z.infer<typeof ObjectIdAsHexString>;

export const UnixTimestamp = z.number().max(2199023255551); // milliseconds
export type UnixTimestamp = z.infer<typeof UnixTimestamp>;

export const Role = z.enum(["admin", "user"]).default("user");
export type Role = z.infer<typeof Role>;

export const User = z.object({
    id: ObjectIdAsHexString,
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: Role,
});
export type User = z.infer<typeof User>;
export type UserInfo = Pick<User, "firstName" | "lastName">;

export const Allergen = z.object({
    id: ObjectIdAsHexString,
    name: z.string().min(1, "Allergen name is required"),
    symptoms: z.array(z.string()).min(1, "At least one symptom is required"),
    treatment: z.string().default(""),
    firstAid: z.string().default(""),
});
export type Allergen = z.infer<typeof Allergen>;

export const AllergySchema = z.object({
    name: z.string().min(1, "Allergy name is required"),
    allergensId: z.array(ObjectIdAsHexString).default([]),
});

export type Allergy = z.infer<typeof AllergySchema>;

export const PAPSchema = z.object({
    _id: ObjectIdAsHexString,
    userId: ObjectIdAsHexString,
    publicId: ObjectIdAsHexString.optional(),
    allowPublic: z.boolean().default(true),
    gender: z.enum(["male", "female", "other"]).nullable().default(null),
    doB: z.date().nullable().default(null),
    allergens: z
        .array(
            z.object({
                allergenId: ObjectIdAsHexString,
                degree: z.number().min(1).max(5),
            }),
        )
        .default([]),
});

export type PAP = z.infer<typeof PAPSchema>;
export type PAPAllergen = z.infer<typeof PAPSchema>["allergens"][number];

export const UserUpdateSchema = z.object({
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

export type UserUpdate = z.infer<typeof UserUpdateSchema>;

export const PersonalAllergenSchema = Allergen.pick({
    name: true,
    symptoms: true,
    treatment: true,
    firstAid: true,
}).extend({ degree: z.number().min(1).max(5).optional() });

export type PersonalAllergen = z.infer<typeof PersonalAllergenSchema>;

export const PublicPAPSchema = PAPSchema.pick({
    doB: true,
    gender: true,
}).extend({
    allergens: z.array(PersonalAllergenSchema).nullable(),
});

export type PublicPAP = z.infer<typeof PublicPAPSchema>;
