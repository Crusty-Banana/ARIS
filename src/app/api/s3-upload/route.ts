import { NextRequest, NextResponse } from "next/server";
import { checkAdmin, processError } from "@/lib/utils";
import { AddFileToS3$Params } from "@/modules/commands/AddFileToS3/typing";
import { handler$AddFileToS3 } from "@/modules/commands/AddFileToS3/handler";

export async function POST(req: NextRequest) {
  try {
    // Check Authentication
    const authCheck = await checkAdmin(req);
    if (!authCheck.success) return authCheck.result;

    // Validate Input
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const parsedBody = AddFileToS3$Params.safeParse({
      file: buffer,
      fileName: file.name,
      contentType: file.type,
    });
    if (!parsedBody.success) {
      return NextResponse.json(
        { message: parsedBody.error.message || "Invalid params" },
        { status: 400 }
      );
    }

    // Handle action
    const { result } = await handler$AddFileToS3(parsedBody.data);

    return NextResponse.json(
      { result, message: "File uploaded successfully" },
      { status: 200 }
    );
  } catch (error) {
    return processError(error);
  }
}
