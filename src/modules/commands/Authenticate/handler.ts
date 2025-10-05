import NextAuth from "next-auth";
import { hash } from "bcryptjs";
import { Db } from "mongodb";
import { Register$Params } from "./typing";
import { handler$AddPAPWithUserId } from "../AddPAPWithUserId/handler";
import { authOptions } from "@/modules/authentication/authConfig";
import { sendVerificationEmail } from "@/modules/email";
import { randomBytes } from "crypto";

export function handler$Authenticate() {
  const handler = NextAuth(authOptions);
  return handler;
}

export async function handler$Register(db: Db, params: Register$Params) {
  const { firstName, lastName, email, password } = params;

  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hash(password, 10);

  const newUser = await db.collection("users").insertOne({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: "user",
    emailVerified: null,
  });

  const verificationToken = randomBytes(32).toString("hex");
  const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour

  await db.collection("verification_tokens").insertOne({
    userId: newUser.insertedId,
    token: verificationToken,
    expires: tokenExpiry,
  });
  // --- Send verification email ---
  await sendVerificationEmail(email, firstName, verificationToken);
  // -------------------------------

  await handler$AddPAPWithUserId(db, {
    userId: newUser.insertedId.toHexString(),
  });

  return;
}
