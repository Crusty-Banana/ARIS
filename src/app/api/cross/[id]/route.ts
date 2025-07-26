import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/modules/mongodb';
import { handler$GetCrossAllergenFromAllergenID } from "@/modules/commands/GetCrossAllergenFromAllergenID/handler";
import { GetCrossAllergenFromAllergenID$Params } from "@/modules/commands/GetCrossAllergenFromAllergenID/typing";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        const parsedBody = GetCrossAllergenFromAllergenID$Params.safeParse({ id });
        if (!parsedBody.success) {
            return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
        }
        const db = await getDb();
        const crossAllergens = await handler$GetCrossAllergenFromAllergenID(db, parsedBody.data);

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