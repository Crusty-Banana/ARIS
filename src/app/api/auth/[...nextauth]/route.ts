import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                const client = await clientPromise;
                const db = client.db();

                const user = await db
                    .collection('users')
                    .findOne({ email: credentials.email });

                if (user && (await compare(credentials.password, user.password))) {
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
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
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };