import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const UserSchema = z.object({
    _id: z.instanceof(ObjectId).optional(),
    name: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export type User = z.infer<typeof UserSchema>;