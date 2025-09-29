import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/modules/mongodb";
import { randomBytes } from "crypto";
import { ZodError } from "zod";
import { sendPasswordResetEmail } from "@/modules/email";
import { RequestReset$Params } from "@/modules/commands/RecoverAccount/typing";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedBody = RequestReset$Params.parse(body);
    const { email } = parsedBody;

    const db = await getDb();
    const user = await db.collection("users").findOne({ email });

    // Always return a success-like message to prevent user enumeration attacks.
    if (user) {
      const resetToken = randomBytes(32).toString("hex");
      const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

      await db.collection("password_reset_tokens").insertOne({
        userId: user._id,
        token: resetToken,
        expires: tokenExpiry,
      });

      // --- Send password reset email here ---
      await sendPasswordResetEmail(email, resetToken);
      // console.log(`Password reset token for ${email}: ${resetToken}`);
      // ------------------------------------
    }

    return NextResponse.json(
      {
        message:
          "If your account exists, a password reset link has been sent to your email.",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid email provided", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
