import { NextRequest, NextResponse } from "next/server";
import { checkAdmin, processError } from "@/lib/utils";
import { getClient, getDb } from "@/modules/mongodb";
import { handler$UpdateUser } from "@/modules/commands/UpdateBusinessType/handler";
import { handler$DeleteUser } from "@/modules/commands/DeleteUser/handler";
import { UpdateUser$Params } from "@/modules/commands/UpdateBusinessType/typing";
import { DeleteUser$Params } from "@/modules/commands/DeleteUser/typing";

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
    const parsedBody = UpdateUser$Params.safeParse({ ...body, id });
    if (!parsedBody.success) {
      return NextResponse.json(
        { message: parsedBody.error.message || "Invalid params" },
        { status: 400 }
      );
    }

    // Handle action
    const db = await getDb();
    const { result } = await handler$UpdateUser(db, parsedBody.data);

    if (result != 1) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return processError(error);
  }
}

export async function DELETE(
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
    const parsedBody = DeleteUser$Params.safeParse({id: id });
    if (!parsedBody.success) {
      return NextResponse.json(
        { message: parsedBody.error.message || "Invalid params" },
        { status: 400 }
      );
    }

    // Handle action
    const db = await getDb();
    const client = await getClient()
    const result = await handler$DeleteUser(db, client, parsedBody.data);

    if (result.deletedCount != 1) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    return NextResponse.json(
      { message: "User deleted successfully",
        result: result.acknowledged,
       },
      { status: 200 }
    );
  } catch (error) {
    return processError(error);
  }
}
