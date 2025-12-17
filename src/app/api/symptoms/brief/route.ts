import { checkAuth, processError } from "@/lib/utils";
import { handler$GetBriefSymptoms } from "@/modules/commands/GetBriefSymptoms/handler";
import { GetBriefSymptoms$Params } from "@/modules/commands/GetBriefSymptoms/typing";
import { getDb } from "@/modules/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Check Authentication
    const authCheck = await checkAuth(req);
    if (!authCheck.success) return authCheck.result;

    // Validate input
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);

    const parsedBody = GetBriefSymptoms$Params.safeParse({ ...searchParams });

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: parsedBody.error.message || "Invalid params",
        },
        { status: 400 }
      );
    }

    // Hanlde action
    const db = await getDb();
    const { result, total } = await handler$GetBriefSymptoms(
      db,
      parsedBody.data
    );

    return NextResponse.json(
      {
        result,
        total,
        message: `Symptoms retrieved successfully, total ${total}`,
      },
      { status: 200 }
    );
  } catch (error) {
    return processError(error);
  }
}
