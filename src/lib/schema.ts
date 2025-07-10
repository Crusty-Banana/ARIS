import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const UserSchema = z.object({
    _id: z.instanceof(ObjectId).optional(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    role: z.enum(['admin', 'user']).default('user'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type User = z.infer<typeof UserSchema>;

export const AllergySchema = z.object({
    _id: z.instanceof(ObjectId).optional(),
    name: z.string(),
    symptoms: z.array(z.string()),
    treatment: z.string(),
    firstAid: z.string(),
    allergens: z.array(z.string()),
});

export type Allergy = z.infer<typeof AllergySchema>;

export const PAPSchema = z.object({
    _id: z.instanceof(ObjectId).optional(),
    userId: z.string(),
    gender: z.enum(['male', 'female', 'other']),
    doB: z.date().optional(),
    allergies: z.array(AllergySchema),
});

export type PAP = z.infer<typeof PAPSchema>;