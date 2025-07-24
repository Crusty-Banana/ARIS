import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare, hash } from 'bcryptjs';
import { Db } from "mongodb";
import { Register$Params } from "./typing";
import { NextResponse } from "next/server";
import { PAPSchema } from "@/modules/business-types";

export function handler$Authenticate(
    db: Db
) {
    const authOptions: AuthOptions = {
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

                    const user = await db
                        .collection('users')
                        .findOne({ email: credentials.email });

                    if (user && (await compare(credentials.password, user.password))) {
                        return {
                            id: user._id.toHexString(),
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            role: user.role,
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
                    token.role = user.role;
                    token.firstName = user.firstName;
                    token.lastName = user.lastName;
                }
                return token;
            },
            async session({ session, token }) {
                if (session.user) {
                    session.user.id = token.id;
                    session.user.role = token.role;
                    session.user.firstName = token.firstName;
                    session.user.lastName = token.lastName;
                }
                return session;
            },
        },
        pages: {
            signIn: '/auth/login',
        },
    };

    const handler = NextAuth(authOptions);
    return handler;
}

export async function handler$Register(
    db: Db,
    params: Register$Params
): Promise<NextResponse> {
    const { firstName, lastName, email, password } = params;

    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
        return NextResponse.json(
            { message: 'User already exists' },
            { status: 400 }
        );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await db.collection('users').insertOne({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'user',
    });

    await db.collection('paps').insertOne(
        PAPSchema.parse({ userId: newUser.insertedId })
    );

    return NextResponse.json(
        { message: 'User registered successfully' },
        { status: 201 }
    );
}