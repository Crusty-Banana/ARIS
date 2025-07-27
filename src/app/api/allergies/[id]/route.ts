import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getDb } from '@/modules/mongodb';
import { GetAllergies$Params } from '@/modules/commands/GetAllergies/typing';
import { handler$GetAllergies } from '@/modules/commands/GetAllergies/handler';
import { handler$DeleteAllergy } from '@/modules/commands/DeleteAllergy/handler';
import { DeleteAllergy$Params } from '@/modules/commands/DeleteAllergy/typing';
import { handler$UpdateAllergy } from '@/modules/commands/UpdateAllergy/handler';
import { UpdateAllergy$Params } from '@/modules/commands/UpdateAllergy/typing';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // const token = await getToken({ req });

        // if (!token) {
        //     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        // }

        const { id } = await params;
        const searchParams = Object.fromEntries(req.nextUrl.searchParams);
        const parsedBody = GetAllergies$Params.safeParse({ ...searchParams, id });
        if (!parsedBody.success) {
            return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
        }

        const db = await getDb();

        const { allergies } = await handler$GetAllergies(db, parsedBody.data);
        if (allergies.length === 0) {
            return NextResponse.json({ message: "Allergies not found" }, { status: 404 });
        }

        return NextResponse.json({ alleries: allergies, message: "Allergy retrieved successfully" }, { status: 200 });
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

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = await getToken({ req });

        if (!token || token.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        const parsedBody = UpdateAllergy$Params.safeParse({ ...body, id })
        if (!parsedBody.success) {
            return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
        }

        const db = await getDb();
        const { result } = await handler$UpdateAllergy(db, parsedBody.data);

        if (result.modifiedCount != 1) {
            return NextResponse.json(
                { message: 'Allergy not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Allergy updated successfully' },
            { status: 200 }
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

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = await getToken({ req });

        if (!token || token.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const parsedBody = DeleteAllergy$Params.safeParse({ id })
        if (!parsedBody.success) {
            return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
        }

        const db = await getDb();

        const { result } = await handler$DeleteAllergy(db, { id });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { message: 'Allergy not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Allergy deleted successfully' },
            { status: 200 }
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