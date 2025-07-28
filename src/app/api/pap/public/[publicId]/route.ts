import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getDb } from "@/modules/mongodb";
import { handler$GetPublicPAP } from "@/modules/commands/GetPublicPAP/handler";
import { GetPublicPAP$Params } from "@/modules/commands/GetPublicPAP/typing";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ publicId: string }> },
) {
    try {
        const { publicId } = await params;
        const parsedBody = GetPublicPAP$Params.safeParse({ publicId });
        if (!parsedBody.success) {
            return NextResponse.json({ error: parsedBody.error.message || "invalid params" }, { status: 400 });
        }

        const db = await getDb();
        const { publicPAP } = await handler$GetPublicPAP(db, parsedBody.data);

        if (!publicPAP) {
            return NextResponse.json(
                { message: "Public PAP not found or is private" },
                { status: 404 },
            );
        }

        return NextResponse.json({ publicPAP, message: "Public PAP found" }, { status: 200 });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { message: "Invalid request body", errors: error.errors },
                { status: 400 },
            );
        }
        let message = "An error occurred";
        if (error instanceof Error) {
            message += `: ${error.message}`;
        }
        return NextResponse.json({ message }, { status: 500 });
    }
}
