import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { ZodError } from "zod";
import { getDb } from "@/modules/mongodb";
import { UpdateUser$Params } from "@/modules/commands/UpdateUser/typing";
import { handler$UpdateUser } from "@/modules/commands/UpdateUser/handler";
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
    try {
        const token = await getToken({ req });
        const { id } = await params;
        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        // A user can update their own profile, or an admin can update any profile.
        if (token.role !== "admin" && token.id !== id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const parsedBody = UpdateUser$Params.safeParse({ ...body, id });

        if (!parsedBody.success) {
            return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
        }

        const db = await getDb();
        const result = await handler$UpdateUser(db, parsedBody.data)

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { message: "User updated successfully" },
            { status: 200 },
        );
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
