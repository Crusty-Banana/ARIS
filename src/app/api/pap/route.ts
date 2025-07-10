import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { PAPSchema } from '@/lib/schema';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req });

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();

        const pap = await db.collection('paps').findOne({ userId: token.id });

        if (!pap) {
            return NextResponse.json({ message: 'Personal Allergy Profile not found' }, { status: 404 });
        }

        return NextResponse.json(pap, { status: 200 });
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

export async function PUT(req: NextRequest) {
    try {
        const token = await getToken({ req });

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const papData = PAPSchema.parse(body);

        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection('paps').updateOne(
            { userId: token.id },
            { $set: papData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { message: 'Personal Allergy Profile not found' },
                { status: 404 }
            );
        }

        const updatedPap = await db.collection('paps').findOne({ userId: token.id });


        return NextResponse.json(
            {
                message: 'Personal Allergy Profile updated successfully',
                pap: updatedPap,
            },
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