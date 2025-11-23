import { NextRequest, NextResponse } from "next/server";
import { checkAdmin, checkAuth, processError } from "@/lib/utils";
import { getDb } from "@/modules/mongodb";
import { GetBriefAllergens$Params } from "@/modules/commands/GetBriefAllergens/typing";
import { handler$GetBriefAllergens } from "@/modules/commands/GetBriefAllergens/handler";
import { AddAllergen$Params } from "@/modules/commands/AddBusinessType/typing";
import { handler$AddAllergen } from "@/modules/commands/AddBusinessType/handler";

export async function GET(req: NextRequest) {
  try {
    // Check Authentication
    const authCheck = await checkAuth(req);
    if (!authCheck.success) return authCheck.result;

    // Validate Input
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);

    const parsedBody = GetBriefAllergens$Params.safeParse({
      ...searchParams,
    });

    if (!parsedBody.success) {
      return NextResponse.json(
        { message: parsedBody.error.message || "Invalid params" },
        { status: 400 }
      );
    }

    // Handle action
    const db = await getDb();
    const { result, total } = await handler$GetBriefAllergens(
      db,
      parsedBody.data
    );

    return NextResponse.json(
      {
        result,
        total,
        message: `Allergens retrieved successfully, total ${total}`,
      },
      { status: 200 }
    );
  } catch (error) {
    return processError(error);
  }
}
