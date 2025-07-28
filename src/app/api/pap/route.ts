import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { getDb } from "@/modules/mongodb";
import { handler$UpdatePAP } from "@/modules/commands/UpdatePAP/handler";
import { UpdatePAP$Params } from "@/modules/commands/UpdatePAP/typing";
import { handler$GetPAP } from "@/modules/commands/GetPAP/handler";
import { GetPAP$Params } from "@/modules/commands/GetPAP/typing";

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req });

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        const userId = token.id;
        const parsedBody = GetPAP$Params.safeParse({ userId });
        if (!parsedBody.success) {
            return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
        }

        const db = await getDb();
        const { PAP } = await handler$GetPAP(db, parsedBody.data);

        if (!PAP) {
            return NextResponse.json(
                { message: "Personal Allergy Profile not found" },
                { status: 404 },
            );
        }
        return NextResponse.json({ PAP, message: "Personal Allergy Profile found" }, { status: 200 });
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

        const userId = token.id;
        const body = await req.json();
        const parsedBody = UpdatePAP$Params.safeParse({
            ...body,
            userId,
        });

        if (!parsedBody.success) {
            return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
        }

        const db = await getDb();

        const { result } = await handler$UpdatePAP(db, parsedBody.data);

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

