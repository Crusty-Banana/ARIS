import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, processError } from '@/lib/utils';
import { getDb } from '@/modules/mongodb';
import { GetProfileWithUserId$Params } from '@/modules/commands/GetProfileWithUserId/typing';
import { handler$GetProfileWithUserId } from '@/modules/commands/GetProfileWithUserId/handler';
import { UpdateProfileWithUserId$Params } from '@/modules/commands/UpdateProfileWithUserId/typing';
import { handler$UpdateProfileWithUserId } from '@/modules/commands/UpdateProfileWithUserId/handler';

export async function GET(
  req: NextRequest
) {
  try {
    // Check Authentication
    const { success, result: authResult, token } = await checkAuth(req);
    if (!success) return authResult;

    const userId = token!.id;

    // Validate Input
    const parsedBody = GetProfileWithUserId$Params.safeParse({ userId });
    if (!parsedBody.success) {
      return NextResponse.json({ message: parsedBody.error.message || "Invalid params" }, { status: 400 });
    }

    // Handle action
    const db = await getDb();
    const { result } = await handler$GetProfileWithUserId(db, parsedBody.data);
    return NextResponse.json({ result, message: "Profile retrieved successfully" }, { status: 200 });
  } catch (error) {
    return processError(error);
  }
}

export async function PUT(
  req: NextRequest
) {
  try {
    // Check Authentication
    const { success, result: authResult, token } = await checkAuth(req);
    if (!success) return authResult;

    const userId = token!.id;

    // Validate Input
    const body = await req.json();
    const parsedBody = UpdateProfileWithUserId$Params.safeParse({ ...body, userId })
    if (!parsedBody.success) {
      return NextResponse.json({ message: parsedBody.error.message || "Invalid params" }, { status: 400 });
    }

    // Handle action
    const db = await getDb();
    const { result } = await handler$UpdateProfileWithUserId(db, parsedBody.data);
    if (result.PAPModified !== 1 && result.userModified !== 1) {
      return NextResponse.json({ message: "No Profile data was modified" }, { status: 404 });
    }
    return NextResponse.json({ result, message: "User Profile updated successfully" }, { status: 200 });
  } catch (error) {
    return processError(error);
  }
}