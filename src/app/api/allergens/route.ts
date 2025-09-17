import { NextRequest, NextResponse } from 'next/server';
import { checkAdmin, checkAuth, processError } from '@/lib/utils';
import { getDb } from '@/modules/mongodb';
import { handler$AddAllergen } from '@/modules/commands/AddBusinessType/handler';
import { handler$GetAllergens } from '@/modules/commands/GetBusinessType/handler';
import { AddAllergen$Params } from '@/modules/commands/AddBusinessType/typing';
import { GetAllergens$Params } from '@/modules/commands/GetBusinessType/typing';

export async function POST(
  req: NextRequest
) {
  try {
    // Check Authentication
    const authCheck = await checkAdmin(req);
    if (!authCheck.success) return authCheck.result;

    // Validate Input
    const body = await req.json();
    const parsedBody = AddAllergen$Params.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({ message: parsedBody.error.message || "Invalid params" }, { status: 400 });
    }

    // Handle action
    const db = await getDb();
    const { result } = await handler$AddAllergen(db, parsedBody.data);

    return NextResponse.json({ result, message: "Allergen created successfully" }, { status: 200 });
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
    console.log(searchParams)
    const parsedBody = GetAllergens$Params.safeParse({ ...searchParams, filters: searchParams.filters ? JSON.parse(searchParams.filters) : undefined });
    console.log(parsedBody)
    if (!parsedBody.success) {
      return NextResponse.json(
        { message: parsedBody.error.message || "Invalid params" },
        { status: 400 }
      );
    }

    // Handle action
    const db = await getDb();
    const { result } = await handler$GetAllergens(db, parsedBody.data);

    return NextResponse.json({ result, message: "Allergens retrieved successfully" }, { status: 200 });
  } catch (error) {
    return processError(error);
  }
}