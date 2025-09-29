import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/modules/mongodb";
import { handler$GetCrossAllergenFromUserID } from "@/modules/commands/GetCrossAllergenFromUserID/handler";
import { GetCrossAllergenFromUserID$Params } from "@/modules/commands/GetCrossAllergenFromUserID/typing";
import { checkAuth, processError } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { success, result: authResult, token } = await checkAuth(req);
    if (!success) return authResult;

    const userId = token!.id;
    const parsedBody = GetCrossAllergenFromUserID$Params.safeParse({
      userID: userId,
    });
    if (!parsedBody.success) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const { result } = await handler$GetCrossAllergenFromUserID(
      db,
      parsedBody.data
    );

    return NextResponse.json(
      { result, message: "Cross allergens fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    return processError(error);
  }
}
