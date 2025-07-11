import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getToken } from 'next-auth/jwt';
import { ObjectId } from 'mongodb';

// It's a good practice to define an interface for the shape of your data.
interface AllergenInPap {
    allergenId: ObjectId;
    degree: number;
}

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req });

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();

        // if (!ObjectId.isValid(token.id)) {
        //     return NextResponse.json(
        //         { message: 'Invalid User ID' },
        //         { status: 400 }
        //     );
        // }

        // 1. Get the user's PAP to find their allergens
        const pap = await db.collection('paps').findOne({ userId: new ObjectId(token.id) });

        if (!pap || !pap.allergens || pap.allergens.length === 0) {
            return NextResponse.json([], { status: 200 }); // No allergens in PAP, so no cross-allergens
        }

        const userAllergenIds = pap.allergens.map((a: AllergenInPap) => a.allergenId);

        // 2. Find all allergy categories that contain any of the user's allergens
        const relatedAllergies = await db.collection('allergies').find({
            allergensId: { $in: userAllergenIds }
        }).toArray();

        // 3. Collect all unique allergen IDs from these categories, excluding the user's own allergens
        const crossAllergenIds = new Set<string>();
        relatedAllergies.forEach(allergy => {
            allergy.allergensId.forEach((allergenId: ObjectId) => {
                const allergenIdStr = allergenId.toString();
                
                if (!userAllergenIds.some((id: ObjectId) => id.toString() === allergenIdStr)) {
                    crossAllergenIds.add(allergenIdStr);
                }
            });
        });

        const uniqueCrossAllergenIds = Array.from(crossAllergenIds).map(id => new ObjectId(id));

        // 4. Fetch the details of the cross-allergens
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