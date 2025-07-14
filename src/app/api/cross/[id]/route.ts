import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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

        // 1. Find all allergy categories that contain the specified allergen
        const relatedAllergies = await db.collection('allergies').find({
            allergensId: allergenId
        }).toArray();

        // 2. Collect all unique allergen IDs from these categories, excluding the original allergen
        const crossAllergenIds = new Set<string>();
        relatedAllergies.forEach(allergy => {
            allergy.allergensId.forEach((xallergenId: ObjectId) => {
                const allergenIdStr = xallergenId.toString();
                if (allergenIdStr !== id) {
                    crossAllergenIds.add(allergenIdStr);
                }
            });
        });

        const uniqueCrossAllergenIds = Array.from(crossAllergenIds).map(idStr => new ObjectId(idStr));

        // 3. Fetch the details of the cross-allergens
        const crossAllergens = await db.collection('allergens').find({
            _id: { $in: uniqueCrossAllergenIds }
        }).toArray();

        return NextResponse.json(crossAllergens, { status: 200 });
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