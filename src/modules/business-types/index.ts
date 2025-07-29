import { z } from "zod";

export const ObjectIdAsHexString = z.string().regex(/^[0-9a-f]{24}$/);
export type ObjectIdAsHexString = z.infer<typeof ObjectIdAsHexString>;

export const UnixTimestamp = z.number().max(2199023255551); // milliseconds
export type UnixTimestamp = z.infer<typeof UnixTimestamp>;

export const Role = z.enum(["admin", "user"]).default("user");
export type Role = z.infer<typeof Role>;

export const DiscoveryMethod = z.enum(["Clinical symptoms", "Paraclinical tests", "Potential", ""]).default("");
export type DiscoveryMethod = z.infer<typeof DiscoveryMethod>;

export const Gender = z.enum(["male", "female", "other", ""]).default("");
export type Gender = z.infer<typeof Gender>;

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
    type: z.enum(["food", "drug", "respiratory"]),
    name: z.string().min(1, "Allergen name is required"),
    symptomsId: z.array(ObjectIdAsHexString).min(1, "At least one symptom is required"),
    prevalence: z.number().min(1).max(5).default(1),
    description: z.string().default(""),
});
export type Allergen = z.infer<typeof Allergen>;

export const Allergy = z.object({
    id: ObjectIdAsHexString,
    name: z.string().min(1, "Allergy name is required"),
    allergensId: z.array(ObjectIdAsHexString).default([]),
});

export type Allergy = z.infer<typeof Allergy>;

export const PAP = z.object({
    id: ObjectIdAsHexString,
    userId: ObjectIdAsHexString,
    publicId: ObjectIdAsHexString.optional(),
    allowPublic: z.boolean(),
    gender: Gender,
    doB: UnixTimestamp.nullable().default(null),
    allergens: z
        .array(
            z.object({
                allergenId: ObjectIdAsHexString,
                discoveryDate: UnixTimestamp.nullable().default(null),
                discoveryMethod: DiscoveryMethod,
                symptomsId: z.array(ObjectIdAsHexString).default([]),
            }),
        )
        .default([]),
});

export type PAP = z.infer<typeof PAP>;

export const Symptom = z.object({
    id: ObjectIdAsHexString,
    name: z.string().min(1, "Symptom name is required"),
    severity: z.number().min(1).max(3),
    prevalence: z.number().min(1).max(5).default(1),
    treatment: z.string().default(""),
});
export type Symptom = z.infer<typeof Symptom>;
