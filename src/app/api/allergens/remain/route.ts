import { NextRequest, NextResponse } from "next/server";
import { checkAuth, processError } from "@/lib/utils";
import { getDb } from "@/modules/mongodb";
import { Db } from "mongodb";
import { GetRemainAllergens$Params } from "@/modules/commands/GetRemainAllergens/typing";
import { handler$GetRemainAllergens } from "@/modules/commands/GetRemainAllergens/handler";

export async function GET(req: NextRequest) {
  try {
    // Check Authentication
    const { success, result: authResult, token } = await checkAuth(req);
    if (!success) return authResult;

    const userId = token!.id;

    // Validate Input
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);

    const parsedBody = GetRemainAllergens$Params.safeParse({
      ...searchParams,
      userId,
    });

    if (!parsedBody.success) {
      return NextResponse.json(
        { message: parsedBody.error.message || "Invalid params" },
        { status: 400 }
      );
    }

    // Handle action
    const db = await getDb();
    const { result } = await handler$GetRemainAllergens(db, parsedBody.data);

    return NextResponse.json(
      {
        result,
        message: `Available allergens retrieved successfully.`,
      },
      { status: 200 }
    );
  } catch (error) {
    return processError(error);
  }
}
