import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/modules/mongodb";
import { GetDetailAllergen$Params } from "@/modules/commands/GetDetailAllergen/typing";
import { handler$GetDetailAllergen } from "@/modules/commands/GetDetailAllergen/handler";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const searchParams = Object.fromEntries(req.nextUrl.searchParams);

    const parsedBody = GetDetailAllergen$Params.safeParse({
      ...searchParams,
      id,
    });
    if (!parsedBody.success) {
      return NextResponse.json(
        { message: parsedBody.error.message || "invalid params" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const { result } = await handler$GetDetailAllergen(db, parsedBody.data);

    if (!result) {
      return NextResponse.json(
        { message: "Allergen detail not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { result, message: "Allergen detail found" },
      { status: 200 }
    );
  } catch (error) {
    let message = "An error occurred";
    if (error instanceof Error) {
      message += `: ${error.message}`;
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}
