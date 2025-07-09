import clientPromise from '@/lib/mongodb';
import { compare } from 'bcryptjs';
import type { User } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { LoginSchema } from './schema';

export const {auth, handlers, signIn, signOut} = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials): Promise<User | null> {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }
                const {email, password} = LoginSchema.parse(credentials)

                const client = await clientPromise;
                const db = client.db();

                const user = await db
                    .collection('users')
                    .findOne({ email: email });
                
                if (user && (await compare(password, user.password))) {
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                        role: user.role
                    };
                }
                return null;
            },
        }),
    ],
    session: {
        strategy: 'jwt' as const,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user && user.id) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
});
