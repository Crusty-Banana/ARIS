import { NextRequest, NextResponse } from 'next/server';
import { AllergySchema } from '@/lib/schema';
import { getToken } from 'next-auth/jwt';
import { ObjectId } from 'mongodb';
import { getDb } from '@/modules/mongodb';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // const token = await getToken({ req });

        // if (!token) {
        //     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        // }

        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: 'Invalid Allergy ID' },
                { status: 400 }
            );
        }

        const db = await getDb();
        const allergyId = new ObjectId(id);

        const result = await db.collection('allergies')
            .findOne({ _id: allergyId });

        if (!result) {
            return NextResponse.json(
                { message: 'Allergy not found' },
                { status: 404 }
            );
        }

        const parsedAllergy = AllergySchema.parse(result);
        return NextResponse.json(
            { allergy: parsedAllergy },
            { status: 200 }
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

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = await getToken({ req });

        if (!token || token.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: 'Invalid Allergy ID' },
                { status: 400 }
            );
        }

        const body = await req.json();

        // Convert string IDs to ObjectIds before validation
        if (body.allergensId && Array.isArray(body.allergensId)) {
            body.allergensId = body.allergensId.map((id: string) => {
                if (ObjectId.isValid(id)) {
                    return new ObjectId(id)
                }
                // Throw an error or handle invalid IDs as you see fit
                throw new Error(`Invalid ObjectId format: ${id}`);
            });
        }
        const allergyData = AllergySchema.parse(body);

        const db = await getDb();
        const allergyId = new ObjectId(id);

        const result = await db.collection('allergies').updateOne(
            { _id: allergyId },
            { $set: allergyData }
        );

        if (!result) {
            return NextResponse.json(
                { message: 'Allergy not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Allergy updated successfully' },
            { status: 200 }
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

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = await getToken({ req });

        if (!token || token.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: 'Invalid Allergy ID' },
                { status: 400 }
            );
        }

        const db = await getDb();
        const allergyId = new ObjectId(id);

        const result = await db.collection('allergies')
            .deleteOne({ _id: allergyId });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { message: 'Allergy not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Allergy deleted successfully' },
            { status: 200 }
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