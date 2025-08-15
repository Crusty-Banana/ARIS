import { NextRequest, NextResponse } from 'next/server';
import { checkAdmin, checkAuth, processError } from '@/lib/utils';
import { getDb } from '@/modules/mongodb';
import { handler$AddSymptom } from '@/modules/commands/AddBusinessType/handler';
import { handler$GetSymptoms } from '@/modules/commands/GetBusinessType/handler';
import { AddSymptom$Params } from '@/modules/commands/AddBusinessType/typing';
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
    const parsedBody = AddSymptom$Params.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({ message: parsedBody.error.message || "Invalid params" }, { status: 400 });
    }

    // Handle action
    const db = await getDb();
    const { result } = await handler$AddSymptom(db, parsedBody.data);

    return NextResponse.json({ result, message: "Symptom created successfully" }, { status: 200 });
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
    const { result } = await handler$GetSymptoms(db, parsedBody.data);

    return NextResponse.json({ result, message: "Symptoms retrieved successfully" }, { status: 200 });
  } catch (error) {
    return processError(error);
  }
}