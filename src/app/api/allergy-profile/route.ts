import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

import { requireAuth } from '@/lib/rbac';
import { NewAllergyProfileSchema } from '@/lib/schema';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
    try {
        const session = await requireAuth();
        const body = await req.json();

        let userIdToUse;

        // If the user is an admin and a user_id is provided in the body, use it.
        // Otherwise, use the user's own ID from the session.
        if (session.user.role === 'admin' && body.user_id) {
            userIdToUse = new ObjectId(body.user_id);
        } else {
            userIdToUse = new ObjectId(session.user.id);
        }

        // Security check: A non-admin user cannot create a profile for someone else.
        if (session.user.role !== 'admin' && body.user_id && body.user_id !== session.user.id) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const newAllergyProfileData = NewAllergyProfileSchema.parse(body);

        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection('allergy_profiles').insertOne({
            ...newAllergyProfileData,
            user_id: userIdToUse,
        });

        return NextResponse.json(
            { message: 'Allergy profile created successfully', id: result.insertedId },
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
