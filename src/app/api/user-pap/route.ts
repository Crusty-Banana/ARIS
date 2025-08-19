import { NextRequest, NextResponse } from "next/server";

import { getDb } from "@/modules/mongodb";
import { handler$GetPAPWithUserId } from "@/modules/commands/GetPAPWithUserId/handler";
import { GetPAPWithUserId$Params } from "@/modules/commands/GetPAPWithUserId/typing";
import { checkAuth, processError } from "@/lib/utils";
import { UpdatePAPWithUserId$Params } from "@/modules/commands/UpdatePAPWithUserId/typing";
import { handler$UpdatePAPWithUserId } from "@/modules/commands/UpdatePAPWithUserId/handler";

export async function GET(req: NextRequest) {
    try {
        const { success, result: authResult, token } = await checkAuth(req);
        if (!success) return authResult;

        const userId = token!.id;
        const parsedBody = GetPAPWithUserId$Params.safeParse({ userId });
        if (!parsedBody.success) {
            return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
        }

        const db = await getDb();
        const { result } = await handler$GetPAPWithUserId(db, parsedBody.data);

        if (!result) {
            return NextResponse.json({ message: "Personal Allergy Profile not found" }, { status: 404 });
        }
        return NextResponse.json({ result, message: "Personal Allergy Profile found" }, { status: 200 });
    } catch (error) {
        return processError(error);
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { success, result: authResult, token } = await checkAuth(req);
        if (!success) return authResult;

        const userId = token!.id;
        const body = await req.json();
        const parsedBody = UpdatePAPWithUserId$Params.safeParse({
            ...body,
            userId,
        });
        if (!parsedBody.success) {
            return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
        }
        console.log(parsedBody.data)
        const db = await getDb();
        const { result } = await handler$UpdatePAPWithUserId(db, parsedBody.data);

        if (result !== 1) {
            return NextResponse.json({ message: "No Personal Allergy Profile was modified" }, { status: 404 });
        }
        return NextResponse.json({ message: "Personal Allergy Profile updated successfully" }, { status: 200 });
    } catch (error) {
        return processError(error);
    }
}

