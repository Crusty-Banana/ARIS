import { NextRequest, NextResponse } from 'next/server';
import { AddAllergen$Params } from '@/modules/commands/AddAllergen/typing';
import { getToken } from 'next-auth/jwt';
import { getDb } from '@/modules/mongodb';
import { handler$AddAllergen } from '@/modules/commands/AddAllergen/handler';
import { handler$GetAllergens } from '@/modules/commands/GetAllergens/handler';
import { GetAllergens$Params } from '@/modules/commands/GetAllergens/typing';

export async function POST(req: NextRequest) {
    try {
        const token = await getToken({ req });

        if (!token || token.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const parsedBody = AddAllergen$Params.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json({ message: parsedBody.error.message || "invalid params" }, { status: 400 });
        }
        const db = await getDb();

        const { insertedId } = await handler$AddAllergen(db, parsedBody.data);

        return NextResponse.json(
            { message: 'Allergen added successfully', allergenId: insertedId },
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
        const token = await getToken({ req });

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = Object.fromEntries(req.nextUrl.searchParams);
        const parsedBody = GetAllergens$Params.safeParse(searchParams);
        if (!parsedBody.success) {
            return NextResponse.json({ message: parsedBody.error.message || "invalid params" }, { status: 400 });
        }

        const db = await getDb();

        const { allergens } = await handler$GetAllergens(db, parsedBody.data);

        return NextResponse.json({ allergens, message: 'Allergens retrieved successfully' }, { status: 200 });
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