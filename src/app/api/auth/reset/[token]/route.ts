import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/modules/mongodb";
import { ZodError } from "zod";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const db = await getDb();
    const resetToken = await db
      .collection("password_reset_tokens")
      .findOne({ token });

    if (!resetToken || resetToken.expires < new Date()) {
      return NextResponse.json(
        { message: "Invalid or expired password reset token." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: "Good token" }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid data provided", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
