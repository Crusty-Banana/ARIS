import { handler$AddSymptom } from "@/modules/commands/AddSymptom/handlers";
import { AddSymptom$Params } from "@/modules/commands/AddSymptom/typing";
import { handler$GetSymptoms } from "@/modules/commands/GetSymptoms/handler";
import { GetSymptoms$Params } from "@/modules/commands/GetSymptoms/typing";
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

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req });

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = Object.fromEntries(req.nextUrl.searchParams);
        const parsedBody = GetSymptoms$Params.safeParse(searchParams);
        if (!parsedBody.success) {
            return NextResponse.json({ messsage: parsedBody.error.message || "invalid params" }, { status: 400 });
        }

        const db = await getDb();
        const { symptoms } = await handler$GetSymptoms(db, parsedBody.data);

        return NextResponse.json({ symptoms, message: "Symptoms fetched successfully." }, { status: 200 });
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

