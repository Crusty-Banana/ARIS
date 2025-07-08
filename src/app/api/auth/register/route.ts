import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { UserSchema } from '@/lib/schema';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, password } = UserSchema.parse(body);

        const client = await clientPromise;
        const db = client.db();

        const existingUser = await db.collection('users').findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 400 }
            );
        }

        const hashedPassword = await hash(password, 10);

        await db.collection('users').insertOne({
            name,
            email,
            password: hashedPassword,
            role: 'user',
        });

        return NextResponse.json(
            { message: 'User registered successfully' },
            { status: 201 }
        );
    } catch (error) {
        let message = "An error occurred";
        if (error instanceof Error) {
            message += `: ${error.message}`;
        }
        return NextResponse.json(
            { message },
            { status: 500 }
        );
    }
}