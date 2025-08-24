import { NextRequest, NextResponse } from 'next/server';
import { checkAdmin, checkAuth, processError } from '@/lib/utils';
import { getDb } from '@/modules/mongodb';
import { handler$AddPAP } from '@/modules/commands/AddBusinessType/handler';
import { handler$GetPAPs } from '@/modules/commands/GetBusinessType/handler';
import { AddPAP$Params } from '@/modules/commands/AddBusinessType/typing';
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
    const parsedBody = AddPAP$Params.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({ message: parsedBody.error.message || "Invalid params" }, { status: 400 });
    }

    // Handle action
    const db = await getDb();
    const { result } = await handler$AddPAP(db, parsedBody.data);

    return NextResponse.json({ result, message: "PAP created successfully" }, { status: 200 });
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
    const { result } = await handler$GetPAPs(db, parsedBody.data);

    return NextResponse.json({ result, message: "PAPs retrieved successfully" }, { status: 200 });
  } catch (error) {
    return processError(error);
  }
}