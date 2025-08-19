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

export const RecommendationType = z.enum(["Allergen Suggestion", "General Feedback", ""]).default("");
export type RecommendationType = z.infer<typeof RecommendationType>;

export const DisplayString = z.object({ "en": z.string().default(""), "vi": z.string().default("") })
export type DisplayString = z.infer<typeof DisplayString>;

export const AllergenType = z.enum(["food", "drug", "respiratory", ""]).default("");
export type AllergenType = z.infer<typeof AllergenType>;

export const Language = z.enum(["en", "vi"]);
export type Language = z.infer<typeof Language>;

export const TestType = z.enum(["skin", "blood", "provocation", ""]);
export type TestType = z.infer<typeof TestType>;

export const FetcherResult = z.object({
    success: z.boolean(),
    message: z.string(),
});
export type FetcherResult = z.infer<typeof FetcherResult>;

export const BusisnessTypeCollection = {
    users: "users",
    allergens: "allergens_en",
    allergies: "allergies_en",
    paps: "paps",
    symptoms: "symptoms_en",
    recommendations: "recommendations",
}

export const User = z.object({
    id: ObjectIdAsHexString,
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: Role,
});
export type User = z.infer<typeof User>;

export const Allergen = z.object({
    id: ObjectIdAsHexString,
    type: AllergenType,
    name: DisplayString,
    description: DisplayString,
    symptomsId: z.array(ObjectIdAsHexString),
    prevalence: z.number().min(1).max(5).default(1),
});
export type Allergen = z.infer<typeof Allergen>;

export const Allergy = z.object({
    id: ObjectIdAsHexString,
    name: DisplayString,
    allergensId: z.array(ObjectIdAsHexString).default([]),
});

export type Allergy = z.infer<typeof Allergy>;

export const PAP = z.object({
    id: ObjectIdAsHexString,
    userId: ObjectIdAsHexString,
    publicId: ObjectIdAsHexString,
    allowPublic: z.boolean(),
    gender: Gender,
    doB: UnixTimestamp.nullable().default(null),
    underlyingMedCon: z.array(z.string()).default([]),
    allergens: z
        .array(
            z.object({
                allergenId: ObjectIdAsHexString,
                discoveryDate: UnixTimestamp.nullable().default(null),
                discoveryMethod: DiscoveryMethod,
                doneTest: z.boolean(),
                testDone: TestType,
                symptomsId: z.array(ObjectIdAsHexString).default([]),
            }),
        )
        .default([]),
});

export type PAP = z.infer<typeof PAP>;

export const Symptom = z.object({
    id: ObjectIdAsHexString,
    name: DisplayString,
    treatment: DisplayString,
    severity: z.number().min(1).max(3),
    prevalence: z.number().min(1).max(5).default(1),
});
export type Symptom = z.infer<typeof Symptom>;

export const Recommendation = z.object({
    id: ObjectIdAsHexString,
    type: RecommendationType,
    content: z.string().default("")
});
export type Recommendation = z.infer<typeof Recommendation>;