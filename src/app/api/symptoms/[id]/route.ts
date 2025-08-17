import { NextRequest, NextResponse } from "next/server";
import { checkAdmin, checkAuth, processError } from "@/lib/utils";
import { getDb } from "@/modules/mongodb";
import { handler$GetSymptoms } from "@/modules/commands/GetBusinessType/handler";
import { handler$UpdateSymptom } from "@/modules/commands/UpdateBusinessType/handler";
import { handler$DeleteSymptom } from "@/modules/commands/DeleteBusinessType/handler";
import { GetBusinessType$Params } from "@/modules/commands/GetBusinessType/typing";
import { UpdateSymptom$Params } from "@/modules/commands/UpdateBusinessType/typing";
import { DeleteBusinessType$Params } from "@/modules/commands/DeleteBusinessType/typing";

export async function GET(
  req: NextRequest,
  { params }:
    {
      params: Promise<{ id: string }>
    }
) {
  try {
    // Check Authentication
    const authCheck = await checkAuth(req);
    if (!authCheck.success) return authCheck.result;

    // Validate Input
    const { id } = await params;
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const parsedBody = GetBusinessType$Params.safeParse({ ...searchParams, id });
    if (!parsedBody.success) {
      return NextResponse.json({ message: parsedBody.error.message || "Invalid params" }, { status: 400 });
    }

    // Handle action
    const db = await getDb();
    const { result } = await handler$GetSymptoms(db, parsedBody.data);

    return NextResponse.json({ result, message: "Symptoms retrieved successfully" }, { status: 200 });
  } catch (error) {
    return processError(error);
  }
}

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
    const parsedBody = UpdateSymptom$Params.safeParse({ ...body, id });
    if (!parsedBody.success) {
      return NextResponse.json({ message: parsedBody.error.message || "Invalid params" }, { status: 400 });
    }

    // Handle action
    const db = await getDb();
    const { result } = await handler$UpdateSymptom(db, parsedBody.data);

    if (result != 1) {
      return NextResponse.json({ message: "Symptom not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Symptom updated successfully" }, { status: 200 });
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
    const { result } = await handler$DeleteSymptom(db, parsedBody.data);

    if (result != 1) {
      return NextResponse.json({ message: "Symptom not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Symptom deleted successfully" }, { status: 200 });
  } catch (error) {
    return processError(error);
  }
}