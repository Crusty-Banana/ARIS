import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/modules/mongodb";
import { PasswordChangeWithUserId$Params } from "@/modules/commands/PasswordChange/typing";
import { checkAuth } from "@/lib/utils";
import { handler$PasswordChangeWithUserId } from "@/modules/commands/PasswordChange/handler";
import { ZodError } from "zod";
export async function PUT(req: NextRequest) {
  try {
    const { success, token, result } = await checkAuth(req);
    if (!success) return result;
    const body = await req.json();
    const userId = token?.id;
    const parsedBody = PasswordChangeWithUserId$Params.parse({
      ...body,
      id: userId,
    });
    const db = await getDb();
    const handler_result = await handler$PasswordChangeWithUserId(
      db,
      parsedBody
    );
    return NextResponse.json(
      {
        result: handler_result.result,
        message: handler_result.result
          ? "Password changed successfully"
          : "Wrong password",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json(
        { result: false, message: error.errors[0].message },
        { status: 400 }
      );
    if (error instanceof Error)
      return NextResponse.json(
        { result: false, message: error.message },
        { status: 500 }
      );
  }
}
