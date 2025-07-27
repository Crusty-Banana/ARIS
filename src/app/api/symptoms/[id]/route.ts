import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getDb } from "@/modules/mongodb";
import { GetSymptoms$Params } from "@/modules/commands/GetSymptoms/typing";
import { handler$GetSymptoms } from "@/modules/commands/GetSymptoms/handler";
import { UpdateSymptom$Params } from "@/modules/commands/UpdateSymptom/typing";
import { handler$UpdateSymptom } from "@/modules/commands/UpdateSymptom/handler";
import { DeleteSymptom$Params } from "@/modules/commands/DeleteSymptom/typing";
import { handler$DeleteSymptom } from "@/modules/commands/DeleteSymptom/handler";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const token = await getToken({ req });
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const searchParams = Object.fromEntries(req.nextUrl.searchParams);
        const parsedBody = GetSymptoms$Params.safeParse({ ...searchParams, id });
        if (!parsedBody.success) {
            return NextResponse.json({ message: parsedBody.error.message || "invalid params" }, { status: 400 });
        }

        const db = await getDb()

        const { symptoms } = await handler$GetSymptoms(db, parsedBody.data);
        if (symptoms.length === 0) {
            return NextResponse.json({ message: "Symptom not found" }, { status: 404 });
        }

        return NextResponse.json({ symptoms: symptoms, message: "Symptom fetched successfully." }, { status: 200 });
    } catch (error) {
        let message = "An error occurred";
        if (error instanceof Error) {
            message += `: ${error.message}`;
        }
        return NextResponse.json({ message }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const token = await getToken({ req });

        if (!token || token.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const body = await req.json();
        const parsedBody = UpdateSymptom$Params.safeParse({ ...body, id });
        if (!parsedBody.success) {
            return NextResponse.json({ message: parsedBody.error.message || "invalid params" }, { status: 400 });
        }

        const db = await getDb();

        const { result } = await handler$UpdateSymptom(db, parsedBody.data);

        if (result.modifiedCount != 1) {
            return NextResponse.json({ message: "Symptom not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Symptom updated successfully" }, { status: 200 });
    } catch (error) {
        let message = "An error occurred";
        if (error instanceof Error) {
            message += `: ${error.message}`;
        }
        return NextResponse.json({ message }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const token = await getToken({ req });

        if (!token || token.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }


        const { id } = await params;
        const parsedBody = DeleteSymptom$Params.safeParse({ id });
        if (!parsedBody.success) {
            return NextResponse.json({ message: parsedBody.error.message || "invalid params" }, { status: 400 });
        }

        const db = await getDb();

        const { result } = await handler$DeleteSymptom(db, parsedBody.data);

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "Symptom not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Symptom deleted successfully" }, { status: 200 });
    } catch (error) {
        let message = "An error occurred";
        if (error instanceof Error) {
            message += `: ${error.message}`;
        }
        return NextResponse.json({ message }, { status: 500 });
    }
}

