import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { AllergenSchema, UpdateAllergenSchema } from '@/lib/schema';
import { requireRole } from '@/lib/rbac';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: 'Invalid Allergen ID' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();
        const allergenId = new ObjectId(id);

        // Fetch the allergen
        const allergen = await db
            .collection('allergens')
            .findOne({ _id: allergenId });

        if (!allergen) {
            return NextResponse.json(
                { message: 'Allergen not found' },
                { status: 404 }
            );
        }

        // Validate the allergen data
        const parsedAllergen = AllergenSchema.parse(allergen);

        return NextResponse.json(
            {
                allergen: parsedAllergen,
            },
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


export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await requireRole("admin");
    try {
        const { id } = await params;
        

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: 'Invalid Allergen ID' },
                { status: 400 }
            );
        }

        const body = await req.json();
        const updateData = UpdateAllergenSchema.parse(body);

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { message: 'No update data provided' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();
        const allergenId = new ObjectId(id);

        const result = await db.collection('allergens').updateOne(
            { _id: allergenId },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { message: 'Allergen not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Allergen updated successfully' },
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

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await requireRole("admin");
    try {
        const { id } = await params;
        

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: 'Invalid Allergen ID' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();
        const allergenId = new ObjectId(id);

        // First, delete the allergen itself
        const result = await db.collection('allergens').deleteOne({ _id: allergenId });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { message: 'Allergen not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: 'Allergen deleted successfully' },
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