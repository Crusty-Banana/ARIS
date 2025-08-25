import { NextRequest, NextResponse } from 'next/server';
import { checkAdmin, checkAuth, processError } from '@/lib/utils';
import { getDb, getClient } from '@/modules/mongodb';
import { handler$AddUser } from '@/modules/commands/AddBusinessType/handler';
import { handler$GetUsers } from '@/modules/commands/GetBusinessType/handler';
import { AddUser$Params } from '@/modules/commands/AddBusinessType/typing';
import { GetBusinessType$Params } from '@/modules/commands/GetBusinessType/typing';
import { DeleteUser$Params } from '@/modules/commands/DeleteUser/typing';
import { handler$DeleteUser } from '@/modules/commands/DeleteUser/handler';

export async function POST(
  req: NextRequest
) {
  try {
    // Check Authentication
    const authCheck = await checkAdmin(req);
    if (!authCheck.success) return authCheck.result;

    // Validate Input
    const body = await req.json();
    const parsedBody = AddUser$Params.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({ message: parsedBody.error.message || "Invalid params" }, { status: 400 });
    }

    // Handle action
    const db = await getDb();
    const { result } = await handler$AddUser(db, parsedBody.data);

    return NextResponse.json({ result, message: "User created successfully" }, { status: 200 });
  } catch (error) {
    return processError(error);
  }
}

export async function GET(
  req: NextRequest
) {
  try {
    // Check Authentication
    const authCheck = await checkAuth(req);
    if (!authCheck.success) return authCheck.result;

    // Validate Input
    const urlSearch = req.nextUrl.searchParams;

    // Support multiple ids: ?ids=...&ids=...
    const params: Record<string, unknown> = Object.fromEntries(urlSearch);

    const id = urlSearch.getAll("id");
    if (id.length > 0) {
      params.id = id; // override with array of ids
    }
    const parsedBody = GetBusinessType$Params.safeParse(params);
    if (!parsedBody.success) {
      return NextResponse.json({ message: parsedBody.error.message || "Invalid params" }, { status: 400 });
    }

    // Handle action
    const db = await getDb();
    const { result } = await handler$GetUsers(db, parsedBody.data);

    return NextResponse.json({ result, message: "Users retrieved successfully" }, { status: 200 });
  } catch (error) {
    return processError(error);
  }
}

export async function DELETE(
  req: NextRequest
) {
  try {
    const { success, result, token } = await checkAuth(req);
    if (!success) return result;
    const userId = token?.id
    const parsedBody = DeleteUser$Params.safeParse({ userId })
    if (!parsedBody.success) {
      return NextResponse.json({ message: parsedBody.error.message || "Invalid params" }, { status: 400 });
    }
    const db = await getDb();
    const client = await getClient();
    const handler_result = await handler$DeleteUser(db, client, parsedBody.data)

    return NextResponse.json({ result: handler_result.acknowledged, message: "Users deleted successfully" }, { status: 200 });

  } catch (error) {
    return processError(error)
  }
}
