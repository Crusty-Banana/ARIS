import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/modules/mongodb";
import { GetDetailSymptom$Params } from "@/modules/commands/GetDetailSymptom/typing";
import { handler$GetDetailSymptom } from "@/modules/commands/GetDetailSymptom/handler";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const searchParams = Object.fromEntries(req.nextUrl.searchParams);

    const parsedBody = GetDetailSymptom$Params.safeParse({
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
    const { result } = await handler$GetDetailSymptom(db, parsedBody.data);

    if (!result) {
      return NextResponse.json(
        { message: "Symptom detail not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { result, message: "Symptom detail found" },
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
