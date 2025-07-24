import { z } from 'zod';

export const Register$Params = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
})

export type Register$Params = z.infer<typeof Register$Params>
