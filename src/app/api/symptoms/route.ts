import { handler$AddSymptom } from "@/modules/commands/AddSymptom/handlers";
import { AddSymptom$Params } from "@/modules/commands/AddSymptom/typing";
import { getDb } from "@/modules/mongodb";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const token = await getToken({ req });

        if (!token || token.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const parsedBody = AddSymptom$Params.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json({ message: parsedBody.error.message || "invalid params" }, { status: 400 });
        }

        const db = await getDb();
        const result = await handler$AddSymptom(db, parsedBody.data);

        return NextResponse.json(
            { message: 'Symptom added successfully', symptomId: result.insertedId },
            { status: 201 }
        );
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

