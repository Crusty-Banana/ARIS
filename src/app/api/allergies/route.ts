import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { AllergySchema } from '@/lib/schema';
import { getToken } from 'next-auth/jwt';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
    try {
        const token = await getToken({ req });

        if (!token || token.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        // Convert string IDs to ObjectIds before validation
        if (body.allergensId && Array.isArray(body.allergensId)) {
            body.allergensId = body.allergensId.map((id: string) => {
                if(ObjectId.isValid(id)) {
                    return new ObjectId(id)
                }
                // Throw an error or handle invalid IDs as you see fit
                throw new Error(`Invalid ObjectId format: ${id}`);
            });
        }

        const allergyData = AllergySchema.parse(body);

        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection('allergies').insertOne(allergyData);

        return NextResponse.json(
            { message: 'Allergy added successfully', allergyId: result.insertedId },
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

export async function GET() {
    try {
        // const token = await getToken({ req });

        // if (!token) {
        //     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        // }

        const client = await clientPromise;
        const db = client.db();

        const allergies = await db.collection('allergies').find({}).toArray();

        return NextResponse.json(allergies, { status: 200 });
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