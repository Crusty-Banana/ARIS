import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/modules/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;
        const db = await getDb();

        const verificationToken = await db.collection('verification_tokens').findOne({ token });

        if (!verificationToken || verificationToken.expires < new Date()) {
            // Redirect to an error page if token is invalid or expired (DUMMY)
            return NextResponse.redirect(new URL('/verification-failed', req.url));
        }

        // Mark user as verified
        await db.collection('users').updateOne(
            { _id: new ObjectId(verificationToken.userId) },
            { $set: { emailVerified: new Date() } }
        );

        // Delete the token so it can't be reused
        await db.collection('verification_tokens').deleteOne({ _id: verificationToken._id });

        // Redirect to login page
        return NextResponse.redirect(new URL('/dashboard', req.url));

    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.redirect(new URL('/verification-failed', req.url));
    }
}