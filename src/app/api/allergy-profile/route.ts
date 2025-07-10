import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ZodError } from 'zod';
import { requireAuth } from '@/lib/rbac';
import { NewAllergyProfileSchema, UpdateAllergyProfileSchema } from '@/lib/schema';
import { ObjectId } from 'mongodb';


function handleError(error: unknown) {
    let message = 'An unknown error occurred';
    let status = 500;

    if (error instanceof ZodError) {
        return NextResponse.json({ message: 'Invalid data provided', errors: error.errors }, { status: 400 });
    }

    if (error instanceof Error) {
        message = error.message;
        if (message.includes('Administrator privileges required')) {
            status = 403; // Forbidden
        } else if (message.includes('Authentication required')) {
            status = 401; // Unauthorized
        }
    }
    return NextResponse.json({ message }, { status });
}

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

export async function GET(req: NextRequest) {
    // GET PROFILE OF CURRENT USER
    try {
        const session = await requireAuth();
        const userIdToUse = new ObjectId(session.user.id)

        const client = await clientPromise;
        const db = client.db();

        let allergyProfile = await db.collection('allergy_profiles').findOne({
            user_id: userIdToUse,
        });

        if (!allergyProfile) {
            return NextResponse.json(
                { message: 'Allergy profile not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { allergyProfile },
            { status: 200 }
        );
    } catch (error) {
        let message = 'An error occurred';
        if (error instanceof Error) {
            message += `: ${error.message}`;
        }
        return NextResponse.json({ message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await requireAuth();
        const user_id = new ObjectId(session.user.id)

        if (!ObjectId.isValid(user_id)) {
            return NextResponse.json({ message: 'Invalid profile ID format' }, { status: 400 });
        }

        const body = await req.json();
        if (session.user.role !== 'admin' && body.user_id && body.user_id !== session.user.id) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const updateData = UpdateAllergyProfileSchema.parse(body);
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ message: 'Update body cannot be empty' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        console.log(user_id)
        const result = await db.collection('allergy_profiles').updateOne(
            { user_id: String(user_id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'Allergy profile not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Allergy profile updated successfully' }, { status: 200 });
    } catch (error) {
        return handleError(error);
    }
}