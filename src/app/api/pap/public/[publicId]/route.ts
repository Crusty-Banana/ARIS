import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { ZodError } from "zod";
import { PublicPAPSchema } from "@/lib/schema";

export async function GET(
    req: NextRequest,
    { params }: { params: { publicId: string } },
) {
    try {
        const { publicId } = await params;

        if (!ObjectId.isValid(publicId)) {
            return NextResponse.json(
                { message: "Invalid PAP ID" },
                { status: 400 },
            );
        }

        const client = await clientPromise;
        const db = client.db();
        const papId = new ObjectId(publicId);

        const pap = await db
            .collection("paps")
            .findOne({ publicId: papId, allowPublic: true });

        if (!pap) {
            return NextResponse.json(
                { message: "PAP not found or is private" },
                { status: 404 },
            );
        }

        const allergens = await db
            .collection("allergens")
            .find({
                _id: { $in: pap.allergens.map((a: any) => a.allergenId) },
            })
            .toArray();

        const populatedAllergens = pap.allergens.map((userAllergen: any) => {
            const allergenDetails = allergens.find(
                (a: any) => String(a._id) === String(userAllergen.allergenId),
            );
            return {
                name: allergenDetails ? allergenDetails.name : "Unknown",
                degree: userAllergen.degree,
                symptoms: allergenDetails ? allergenDetails.symptoms : [],
                treatment: allergenDetails ? allergenDetails.treatment : "",
                firstAid: allergenDetails ? allergenDetails.firstAid : "",
            };
        });

        const publicPap = PublicPAPSchema.parse({
            gender: pap.gender,
            doB: pap.doB,
            allergens: populatedAllergens,
        });

        return NextResponse.json(publicPap, { status: 200 });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { message: "Invalid request body", errors: error.errors },
                { status: 400 },
            );
        }
        let message = "An error occurred";
        if (error instanceof Error) {
            message += `: ${error.message}`;
        }
        return NextResponse.json({ message }, { status: 500 });
    }
}
