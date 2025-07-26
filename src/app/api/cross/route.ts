import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getDb } from '@/modules/mongodb';
import { handler$GetCrossAllergenFromUserID } from "@/modules/commands/GetCrossAllergenFromUserID/handler";
import { GetCrossAllergenFromUserID$Params } from "@/modules/commands/GetCrossAllergenFromUserID/typing";


export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req });

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = token.id;
        const parsedBody = GetCrossAllergenFromUserID$Params.safeParse({ "userID": userId });
        if (!parsedBody.success) {
            return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
        }

        const db = await getDb();
        const crossAllergens = await handler$GetCrossAllergenFromUserID(db, parsedBody.data);

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