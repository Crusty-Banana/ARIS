import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getDb } from "@/modules/mongodb";
import { handler$GetAllergens } from "@/modules/commands/GetAllergens/handler";
import { GetAllergens$Params } from "@/modules/commands/GetAllergens/typing";
import { handler$UpdateAllergen } from "@/modules/commands/UpdateAllergen/handler";
import { UpdateAllergen$Params } from "@/modules/commands/UpdateAllergen/typing";
import { handler$DeleteAllergen } from "@/modules/commands/DeleteAllergen/handler";
import { DeleteAllergen$Params } from "@/modules/commands/DeleteAllergen/typing";

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
        const parsedBody = GetAllergens$Params.safeParse({ ...searchParams, id });
        if (!parsedBody.success) {
            return NextResponse.json({ message: parsedBody.error.message || "invalid params" }, { status: 400 });
        }

        const db = await getDb()

        const { allergens } = await handler$GetAllergens(db, parsedBody.data);
        if (allergens.length === 0) {
            return NextResponse.json({ message: "Allergen not found" }, { status: 404 });
        }

        return NextResponse.json({ allergens: allergens, message: "Allergen retrieved successfully" }, { status: 200 });
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
        const parsedBody = UpdateAllergen$Params.safeParse({ ...body, id });
        if (!parsedBody.success) {
            return NextResponse.json({ message: parsedBody.error.message || "invalid params" }, { status: 400 });
        }

        const db = await getDb();

        const { result } = await handler$UpdateAllergen(db, parsedBody.data);

        if (result.modifiedCount != 1) {
            return NextResponse.json({ message: "Allergen not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Allergen updated successfully" }, { status: 200 });
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
        const parsedBody = DeleteAllergen$Params.safeParse({ id });
        if (!parsedBody.success) {
            return NextResponse.json({ message: parsedBody.error.message || "invalid params" }, { status: 400 });
        }

        const db = await getDb();

        const { result } = await handler$DeleteAllergen(db, parsedBody.data);

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "Allergen not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Allergen deleted successfully" }, { status: 200 });
    } catch (error) {
        let message = "An error occurred";
        if (error instanceof Error) {
            message += `: ${error.message}`;
        }
        return NextResponse.json({ message }, { status: 500 });
    }
}

