import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getDb } from '@/modules/mongodb';
import { AddAllergy$Params } from '@/modules/commands/AddAllergy/typing';
import { handler$AddAllergy } from '@/modules/commands/AddAllergy/handler';

export async function POST(req: NextRequest) {
    try {
        const token = await getToken({ req });

        if (!token || token.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const parsedBody = AddAllergy$Params.safeParse(body);
        if (!parsedBody.success) {
            return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
        }

        const db = await getDb();
        const allergyId = await handler$AddAllergy(db, parsedBody.data);

        return NextResponse.json(
            { message: 'Allergy added successfully', allergyId },
            { status: 201 }
        );
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

export async function GET() {
    try {
        // const token = await getToken({ req });

        // if (!token) {
        //     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        // }

        const db = await getDb();

        const allergies = await db.collection('allergies').find({}).toArray();

        return NextResponse.json(allergies, { status: 200 });
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