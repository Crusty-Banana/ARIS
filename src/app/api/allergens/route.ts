import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { AllergenSchema } from '@/lib/schema';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
    try {
        const token = await getToken({ req });

        if (!token || token.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const allergenData = AllergenSchema.parse(body);

        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection('allergens').insertOne(allergenData);

        return NextResponse.json(
            { message: 'Allergen added successfully', allergenId: result.insertedId },
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

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req });

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();

        const allergens = await db.collection('allergens').find({}).toArray();

        return NextResponse.json(allergens, { status: 200 });
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