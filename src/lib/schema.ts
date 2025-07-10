import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const UserSchema = z.object({
    _id: z.instanceof(ObjectId).optional(),
    // firstName: z.string().min(1, 'First name is required'),
    // lastName: z.string().min(1, 'Last name is required'),
    name: z.string().min(1, 'Full name is required'),
    role: z.enum(['admin', 'user']).default('user'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export type User = z.infer<typeof UserSchema>;

export const AllergenSchema = z.object({
    _id: z.instanceof(ObjectId),
    name: z.string(),
    type: z.enum(['inhale', 'eat', 'inject', 'touch']),
    class: z.enum(['molecular', 'general', 'medicine']),
    symptoms: z.array(z.string()),
    treatments: z.array(z.string()),
    first_aid: z.array(z.string()),
    information: z.string(),
});

/**
 * Schema for creating a new Allergen (omits _id)
 */
export const NewAllergenSchema = AllergenSchema.omit({ _id: true });

/**
 * Schema for updating an existing Allergen (all fields are optional)
 */
export const UpdateAllergenSchema = NewAllergenSchema.partial();

export type Allergen = z.infer<typeof AllergenSchema>;
export type NewAllergen = z.infer<typeof NewAllergenSchema>;
export type UpdateAllergen = z.infer<typeof UpdateAllergenSchema>;

export const AllergyProfileSchema = z.object({
    _id: z.instanceof(ObjectId),
    gender: z.enum(['male', 'female', 'other']),
    doB: z.date().optional(),
    user_id: z.string(),
    allergies: z.array(AllergenSchema),
});

/**
 * Schema for creating a new Allergy Profile (omits _id)
 */
export const NewAllergyProfileSchema = AllergyProfileSchema.omit({ _id: true });

/**
 * Schema for updating an existing Allergy Profile (all fields are optional)
 */
export const UpdateAllergyProfileSchema = NewAllergyProfileSchema.partial();

export type AllergyProfile = z.infer<typeof AllergyProfileSchema>;
export type NewAllergyProfile = z.infer<typeof NewAllergyProfileSchema>;
export type UpdateAllergyProfile = z.infer<typeof UpdateAllergyProfileSchema>;