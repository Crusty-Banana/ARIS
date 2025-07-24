import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/modules/mongodb';
import { handler$Register } from '@/modules/commands/Authenticate/handler';
import { Register$Params } from '@/modules/commands/Authenticate/typing';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsedBody = Register$Params.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json(
                {
                    error: parsedBody.error.message || "invalid params",
                },
                { status: 400 }
            );
        }

        const db = await getDb();

        const response = await handler$Register(db, parsedBody.data);

        return response;
    } catch (error) {
        let message = "An error occurred";
        if (error instanceof Error) {
            message += `: ${error.message}`;
        }
        return NextResponse.json(
            { message },
            { status: 500 }
        );
    }
}