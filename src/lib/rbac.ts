import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export type Role = 'user' | 'admin';

export async function requireAuth() {
    const session = await auth();
    if (!session) {
        redirect('/login');
    }
    return session
}

export async function requireRole(requireRole: Role) {
    const session = await requireAuth();
    const role = session.user.role as Role;

    if (role !== requireRole) {
        redirect('/unauthorized')
    }

    return session
}

export function canAccess(role: Role, requireRole: Role) {
    return role = requireRole;
}