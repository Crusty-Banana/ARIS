import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/modules/mongodb';
import { handler$GetCrossAllergenFromAllergenID } from "@/modules/commands/GetCrossAllergenFromAllergenID/handler";
import { GetCrossAllergenFromAllergenID$Params } from "@/modules/commands/GetCrossAllergenFromAllergenID/typing";
import { processError } from '@/lib/utils';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const parsedBody = GetCrossAllergenFromAllergenID$Params.safeParse({ id });
        if (!parsedBody.success) {
            return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
        }
        const db = await getDb();
        const { result } = await handler$GetCrossAllergenFromAllergenID(db, parsedBody.data);

        return NextResponse.json({ result, message: "Cross allergens fetched successfully" }, { status: 200 });
    } catch (error) {
        return processError(error);
    }
}