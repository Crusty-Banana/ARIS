import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { UserUpdateSchema, UserUpdate } from "@/lib/schema";
import { getToken } from "next-auth/jwt";
import { ObjectId } from "mongodb";
import { ZodError } from "zod";
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

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid User ID" },
                { status: 400 },
            );
        }

        const body = await req.json();
        const { ...rest } = UserUpdateSchema.parse(body);

        const client = await clientPromise;
        const db = client.db();
        const userId = new ObjectId(id);

        const updateData: UserUpdate = { ...rest };

        const result = await db
            .collection("users")
            .updateOne({ _id: userId }, { $set: updateData });

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
