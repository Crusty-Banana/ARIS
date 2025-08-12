import { handler$AddRecommendation } from "@/modules/commands/AddRecommendation/handler";
import { AddRecommendation$Params } from "@/modules/commands/AddRecommendation/typing";
import { getDb } from "@/modules/mongodb";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const token = await getToken({ req });
        
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        
        const body = await req.json();
        const parsedBody = AddRecommendation$Params.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json({ message: parsedBody.error.message || "invalid params" }, { status: 400 });
        }
        const db = await getDb();

        const { insertedId } = await handler$AddRecommendation(db, parsedBody.data);

        return NextResponse.json(
            { message: 'Recommendation added successfully', recommendationId: insertedId },
            { status: 201 }
        );
    } catch (error) {
        let message = "An error occurred";
        if (error instanceof Error) {
            message += `: ${error.message}`;
        }
        return NextResponse.json(
            { message },
            { status: 500},
        )
    }
}