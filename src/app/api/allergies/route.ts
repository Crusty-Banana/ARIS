import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getDb } from '@/modules/mongodb';
import { AddAllergy$Params } from '@/modules/commands/AddAllergy/typing';
import { handler$AddAllergy } from '@/modules/commands/AddAllergy/handler';
import { GetAllergies$Params } from '@/modules/commands/GetAllergies/typing';
import { handler$GetAllergies } from '@/modules/commands/GetAllergies/handler';

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
        const { insertedId } = await handler$AddAllergy(db, parsedBody.data);

        return NextResponse.json(
            { message: 'Allergy added successfully', allergyId: insertedId },
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

export async function GET(req: NextRequest) {
    try {
        // const token = await getToken({ req });

        // if (!token) {
        //     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        // }

        const searchParams = Object.fromEntries(req.nextUrl.searchParams);
        const parsedBody = GetAllergies$Params.safeParse(searchParams);
        if (!parsedBody.success) {
            return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
        }

        const db = await getDb();

        const { allergies } = await handler$GetAllergies(db, parsedBody.data);

        return NextResponse.json({ allergies, message: "Allergies retrieved successfully" }, { status: 200 });
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