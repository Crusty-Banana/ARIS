import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const UserSchema = z.object({
    _id: z.instanceof(ObjectId).optional(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['admin', 'user']).default('user'),
});

export type User = z.infer<typeof UserSchema>;

export const AllergenSchema = z.object({
    _id: z.instanceof(ObjectId).optional(),
    name: z.string().min(1, 'Allergen name is required'),
    symptoms: z.array(z.string()).min(1, 'At least one symptom is required'),
    treatment: z.string().optional(),
    firstAid: z.string().optional(),
});

export type Allergen = z.infer<typeof AllergenSchema>;

export const AllergySchema = z.object({
    name: z.string().min(1, 'Allergy name is required'),
    allergensId: z.array(z.instanceof(ObjectId)).default([]),
});

export type Allergy = z.infer<typeof AllergySchema>;

export const PAPSchema = z.object({
    _id: z.instanceof(ObjectId).optional(),
    userId: z.instanceof(ObjectId),
    publicId: z.instanceof(ObjectId).default(() => new ObjectId()),
    allowPublic: z.boolean().default(true),
    gender: z.enum(['male', 'female', 'other']).nullable().default(null),
    doB: z.date().nullable().default(null),
    allergens: z.array(
        z.object({
            allergenId: z.instanceof(ObjectId),
            degree: z.number(),
        })
    ).default([]),
});

export type PAP = z.infer<typeof PAPSchema>;