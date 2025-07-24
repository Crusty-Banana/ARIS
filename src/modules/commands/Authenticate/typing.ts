import { User } from '@/modules/business-types';
import { z } from 'zod';

export const Register$Params = User.omit({ id: true, role: true });
export type Register$Params = z.infer<typeof Register$Params>;
