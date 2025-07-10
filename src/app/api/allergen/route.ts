import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { NewAllergenSchema } from '@/lib/schema';
import { requireRole } from '@/lib/rbac';

export async function POST(req: NextRequest) {
    await requireRole("admin");
    try {
        

        const body = await req.json();
        const newAllergenData = NewAllergenSchema.parse(body);

        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection('allergens').insertOne(newAllergenData);

        return NextResponse.json(
            { message: 'Allergen created successfully', id: result.insertedId },
            { status: 201 }
        );
    } catch (error) {
        let message = 'An error occurred';
        if (error instanceof Error) {
            message += `: ${error.message}`;
        }
        return NextResponse.json(
            { message },
            { status: 500 }
        );
    }
}