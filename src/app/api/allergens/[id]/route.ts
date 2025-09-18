import { NextRequest, NextResponse } from "next/server";
import { checkAdmin, processError } from "@/lib/utils";
import { getDb } from "@/modules/mongodb";
import { handler$UpdateAllergen } from "@/modules/commands/UpdateBusinessType/handler";
import { handler$DeleteAllergen } from "@/modules/commands/DeleteBusinessType/handler";
import { UpdateAllergen$Params } from "@/modules/commands/UpdateBusinessType/typing";
import { DeleteBusinessType$Params } from "@/modules/commands/DeleteBusinessType/typing";


export async function PUT(
  req: NextRequest,
  { params }:
    {
      params: Promise<{ id: string }>
    }
) {
  try {
    // Check Authentication
    const authCheck = await checkAdmin(req);
    if (!authCheck.success) return authCheck.result;

    // Validate Input
    const { id } = await params;
    const body = await req.json();
    const parsedBody = UpdateAllergen$Params.safeParse({ ...body, id });
    if (!parsedBody.success) {
      return NextResponse.json({ message: parsedBody.error.message || "Invalid params" }, { status: 400 });
    }

    // Handle action
    const db = await getDb();
    const { result } = await handler$UpdateAllergen(db, parsedBody.data);

    if (result != 1) {
      return NextResponse.json({ message: "Allergen not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Allergen updated successfully" }, { status: 200 });
  } catch (error) {
    return processError(error);
  }
}


export async function DELETE(
  req: NextRequest,
  { params }:
    {
      params: Promise<{ id: string }>
    }
) {
  try {
    // Check Authentication
    const authCheck = await checkAdmin(req);
    if (!authCheck.success) return authCheck.result;

    // Validate Input
    const { id } = await params;
    const parsedBody = DeleteBusinessType$Params.safeParse({ id });
    if (!parsedBody.success) {
      return NextResponse.json({ message: parsedBody.error.message || "Invalid params" }, { status: 400 });
    }

    // Handle action
    const db = await getDb();
    const { result } = await handler$DeleteAllergen(db, parsedBody.data);

    if (result != 1) {
      return NextResponse.json({ message: "Allergen not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Allergen deleted successfully" }, { status: 200 });
  } catch (error) {
    return processError(error);
  }
}