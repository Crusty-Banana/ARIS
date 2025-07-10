import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { AllergySchema } from '@/lib/schema';
import { getToken } from 'next-auth/jwt';
import { ObjectId } from 'mongodb';

export async function GET(
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

        const client = await clientPromise;
        const db = client.db();
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
            { allergen: parsedAllergy },
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
        const allergyData = AllergySchema.parse(body);

        const client = await clientPromise;
        const db = client.db();
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
            { message: 'Allergen updated successfully' },
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

        const client = await clientPromise;
        const db = client.db();
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