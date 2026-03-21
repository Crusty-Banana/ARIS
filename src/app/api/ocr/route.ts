import { OCRUserinput$input } from "@/modules/commands/UploadOCRResult/typing";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/modules/mongodb";
import { handler$OCRUpload } from "@/modules/commands/UploadOCRResult/handler";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedBody = OCRUserinput$input.safeParse(body);
    console.log("start");

    console.log(parsedBody);
    console.log("end");
    if (!parsedBody.success) {
      return NextResponse.json(
        { message: parsedBody.error.message || "invalid params" },
        { status: 400 }
      );
    }

    const db = await getDb();

    await handler$OCRUpload(db, parsedBody.data);

    return NextResponse.json(
      { message: "Entry successfully added" },
      { status: 201 }
    );
  } catch (error) {
    let message = "An error occurred";
    if (error instanceof Error) {
      message += `: ${error.message}`;
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}
