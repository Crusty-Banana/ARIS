import { NextRequest, NextResponse } from 'next/server';
import { checkAdmin, checkAuth, processError } from '@/lib/utils';
import { getDb } from '@/modules/mongodb';
import { handler$AddUser } from '@/modules/commands/AddBusinessType/handler';
import { handler$GetUsers } from '@/modules/commands/GetBusinessType/handler';
import { handler$UpdateUser } from '@/modules/commands/UpdateBusinessType/handler';
import { AddUser$Params } from '@/modules/commands/AddBusinessType/typing';
import { UpdateUser$Params } from '@/modules/commands/UpdateBusinessType/typing';
import { GetBusinessType$Params } from '@/modules/commands/GetBusinessType/typing';

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
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const parsedBody = GetBusinessType$Params.safeParse(searchParams);
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

export async function PUT(
  req: NextRequest
) {
  try {
    const { success, result: authResult, token } = await checkAuth(req);

    if (!success) return authResult;
    const body = await req.json();
    const userId = token?.id
    const merged = { ...body, ...{ id: userId } }
    console.log(merged)
    const parsedBody = UpdateUser$Params.safeParse(merged);
    if (!parsedBody.success) {
      return NextResponse.json({ message: parsedBody.error.message || "Invalid params" }, { status: 400 });
    }
    const db = await getDb();
    const result = await handler$UpdateUser(db, parsedBody.data);

    return NextResponse.json({ result, message: "User created successfully" }, { status: 200 });

  } catch (error) {
    return processError(error);
  }
}