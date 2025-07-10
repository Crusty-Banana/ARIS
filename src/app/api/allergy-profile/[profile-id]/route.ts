import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { requireRole } from '@/lib/rbac';
import { UpdateAllergyProfileSchema } from '@/lib/schema';
import { ObjectId } from 'mongodb';
import { ZodError } from 'zod';

/**
 * Handles errors and returns a standardized JSON response.
 * @param {unknown} error - The error caught.
 * @returns {NextResponse} The JSON response.
 */
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

/**
 * GET /api/user/profile/[id]
 * Fetches a specific allergy profile by its ID.
 * Admin only.
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await requireRole("admin");
        const { id } = params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid profile ID format' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        const allergyProfile = await db.collection('allergy_profiles').findOne({
            _id: new ObjectId(id),
        });

        if (!allergyProfile) {
            return NextResponse.json({ message: 'Allergy profile not found' }, { status: 404 });
        }

        return NextResponse.json({ allergyProfile }, { status: 200 });
    } catch (error) {
        return handleError(error);
    }
}

/**
 * PUT /api/user/profile/[id]
 * Updates a specific allergy profile by its ID.
 * Admin only.
 */
export async function PUT(req: NextRequest, { params }: { params: { id:string } }) {
    try {
        await requireRole("admin");
        const { id } = params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid profile ID format' }, { status: 400 });
        }

        const body = await req.json();
        const updateData = UpdateAllergyProfileSchema.parse(body);

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ message: 'Update body cannot be empty' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection('allergy_profiles').updateOne(
            { _id: new ObjectId(id) },
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

/**
 * DELETE /api/user/profile/[id]
 * Deletes a specific allergy profile by its ID.
 * Admin only.
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await requireRole("admin");
        const { id } = params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid profile ID format' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection('allergy_profiles').deleteOne({
            _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'Allergy profile not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Allergy profile deleted successfully' }, { status: 200 });
    } catch (error) {
        return handleError(error);
    }
}
