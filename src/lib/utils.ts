import { clsx, type ClassValue } from "clsx"
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function checkAuth(req: NextRequest) {
  const token = await getToken({ req });

  if (!token) {
    return {
      success: false, result: NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
  }
  return { success: true, token: token };
}

export async function checkAdmin(req: NextRequest) {
  const token = await getToken({ req });

  if (!token || token.role !== 'admin') {
    return {
      success: false, result: NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
  }
  return { success: true, token: token };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function processError(error: any) {
  let message = "An error occurred";
  if (error instanceof Error) {
    message += `: ${error.message}`;
  }
  return NextResponse.json(
    { message },
    { status: 500 }
  );
}