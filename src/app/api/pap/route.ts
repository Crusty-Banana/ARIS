import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";
import { ObjectId } from "mongodb";

import { z } from "zod";

export const UpdatePAPSchema = z.object({
    allowPublic: z.boolean().default(true),
    gender: z.enum(["male", "female", "other"]).nullable().default(null),
    doB: z.date().nullable().default(null),
    allergens: z
        .array(
            z.object({
                allergenId: z.instanceof(ObjectId),
                degree: z.number(),
            }),
        )
        .default([]),
});

export type UpdatePAP = z.infer<typeof UpdatePAPSchema>;

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req });

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        const client = await clientPromise;
        const db = client.db();

        if (!ObjectId.isValid(token.id)) {
            return NextResponse.json(
                { message: "Invalid User ID" },
                { status: 400 },
            );
        }

        const pap = await db
            .collection("paps")
            .findOne({ userId: new ObjectId(token.id) });

        if (!pap) {
            return NextResponse.json(
                { message: "Personal Allergy Profile not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(pap, { status: 200 });
    } catch (error) {
        let message = "An error occurred";
        if (error instanceof Error) {
            message += `: ${error.message}`;
        }
        return NextResponse.json({ message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const token = await getToken({ req });

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        const body = await req.json();
        body.doB = new Date(body.doB);
        body.allergens = body.allergens.map(
            (allergen: { allergenId: string; degree: number }) => ({
                allergenId: new ObjectId(allergen.allergenId),
                degree: allergen.degree,
            }),
        );

        const papData = UpdatePAPSchema.parse(body);

        const client = await clientPromise;
        const db = client.db();

        if (!ObjectId.isValid(token.id)) {
            return NextResponse.json(
                { message: "Invalid User ID" },
                { status: 400 },
            );
        }

        const result = await db
            .collection("paps")
            .updateOne({ userId: new ObjectId(token.id) }, { $set: papData });

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { message: "Personal Allergy Profile not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { message: "Personal Allergy Profile updated successfully" },
            { status: 200 },
        );
    } catch (error) {
        let message = "An error occurred";
        if (error instanceof Error) {
            message += `: ${error.message}`;
        }
        return NextResponse.json({ message }, { status: 500 });
    }
}

