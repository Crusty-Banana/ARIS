import { NextRequest, NextResponse } from "next/server";
import { checkAdmin, processError } from "@/lib/utils";
import { getDb } from "@/modules/mongodb";
import { handler$UpdateActionPlan } from "@/modules/commands/UpdateBusinessType/handler";
import { UpdateActionPlan$Params } from "@/modules/commands/UpdateBusinessType/typing";

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    // Check Authentication
    const authCheck = await checkAdmin(req);
    if (!authCheck.success) return authCheck.result;

    // Validate Input
    const { id } = await params;
    const body = await req.json();
    const parsedBody = UpdateActionPlan$Params.safeParse({ ...body, id });
    if (!parsedBody.success) {
      return NextResponse.json(
        { message: parsedBody.error.message || "Invalid params" },
        { status: 400 }
      );
    }

    // Handle action
    const db = await getDb();
    const { result } = await handler$UpdateActionPlan(db, parsedBody.data);

    if (result != 1) {
      return NextResponse.json(
        { message: "ActionPlan not found or no changes were made." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "ActionPlan updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return processError(error);
  }
}