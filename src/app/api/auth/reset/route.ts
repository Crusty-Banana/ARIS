import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/modules/mongodb";
import { hash } from "bcryptjs";
import { ZodError } from "zod";
import { ObjectId } from "mongodb";
import { ResetPassword$Params } from "@/modules/commands/RecoverAccount/typing";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password } = ResetPassword$Params.parse(body);

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

    const hashedPassword = await hash(password, 10);

    // Update user's password
    await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(resetToken.userId) },
        { $set: { password: hashedPassword } }
      );

    // Delete the token to prevent reuse
    await db
      .collection("password_reset_tokens")
      .deleteOne({ _id: resetToken._id });

    return NextResponse.json(
      { message: "Password has been reset successfully." },
      { status: 200 }
    );
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
