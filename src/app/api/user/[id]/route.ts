import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { ZodError } from "zod";
import { getDb, getClient } from "@/modules/mongodb";
import { UpdateUser$Params } from "@/modules/commands/UpdateUser/typing";
import { handler$UpdateUser } from "@/modules/commands/UpdateUser/handler";
import { handler$DeleteUser } from "@/modules/commands/DeleteUser/handler";
import { DeleteUser$Params } from "@/modules/commands/DeleteUser/typing";

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

// New DELETE function
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
    try {
        const token = await getToken({ req });
        const { id } = await params;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Authorization: An admin or the user themselves can delete the account.
        if (token.role !== "admin" && token.id !== id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
        
        const parsedParams = DeleteUser$Params.safeParse({ id });
         if (!parsedParams.success) {
            return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
        }

        const db = await getDb();
        const client = await getClient();
        const result = await handler$DeleteUser(db, client, parsedParams.data);

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });

    } catch (error) {
        let message = "An error occurred during deletion";
        if (error instanceof Error) {
            message = error.message;
        }
        return NextResponse.json({ message }, { status: 500 });
    }
}