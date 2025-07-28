import { NextRequest, NextResponse } from "next/server";
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
            return NextResponse.json({ message: parsedBody.error.message || "invalid params" }, { status: 400 });
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
        let message = "An error occurred";
        if (error instanceof Error) {
            message += `: ${error.message}`;
        }
        return NextResponse.json({ message }, { status: 500 });
    }
}
