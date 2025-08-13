import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getDb } from '@/modules/mongodb';
import z from 'zod';
import { Db } from 'mongodb';
import { ObjectIdAsHexString } from '@/modules/business-types';

export function createAddRoute<addParams>({
  needAuth,
  needAdmin,
  addParams,
  addHandler,
  documentName,
}: {
  needAuth: boolean,
  needAdmin: boolean,
  addParams: z.AnyZodObject,
  addHandler: (db: Db, params: addParams) => Promise<{ result: ObjectIdAsHexString }>,
  documentName: string,
}) {
  return async (req: NextRequest) => {
    try {
      if (needAuth) {
        const token = await getToken({ req });

        if (!token || (token.role !== 'admin' && needAdmin)) {
          return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
      }

      const body = await req.json();
      const parsedBody = addParams.safeParse(body);

      if (!parsedBody.success) {
        return NextResponse.json({ message: parsedBody.error.message || "Invalid params" }, { status: 400 });
      }
      const db = await getDb();

      const { result } = await addHandler(db, parsedBody.data as addParams);

      return NextResponse.json(
        { message: `${documentName} added successfully`, result },
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
}

export function createGetManyRoute<getParams, BusinessType>({
  needAuth,
  needAdmin,
  getParams,
  getHandler,
  documentName,
}: {
  needAuth: boolean,
  needAdmin: boolean,
  getParams: z.AnyZodObject,
  getHandler: (db: Db, params: getParams) => Promise<{ result: BusinessType[] }>,
  documentName: string,
}) {
  return async (req: NextRequest) => {
    try {
      if (needAuth) {
        const token = await getToken({ req });

        if (!token || (token.role !== 'admin' && needAdmin)) {
          return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
      }
      const searchParams = Object.fromEntries(req.nextUrl.searchParams);
      const parsedBody = getParams.safeParse(searchParams);
      if (!parsedBody.success) {
        return NextResponse.json({ message: parsedBody.error.message || "Invalid params" }, { status: 400 });
      }

      const db = await getDb();

      const { result } = await getHandler(db, parsedBody.data as getParams);

      return NextResponse.json({ result, message: `${documentName} list retrieved successfully` }, { status: 200 });
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
}

export function createGetOneRoute<getParams, BusinessType>({
  needAuth,
  needAdmin,
  getParams,
  getHandler,
  documentName = "",
}: {
  needAuth: boolean,
  needAdmin: boolean,
  getParams: z.AnyZodObject,
  getHandler: (db: Db, params: getParams) => Promise<{ result: BusinessType[] }>,
  documentName?: string,
}) {
  return async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      if (needAuth) {
        const token = await getToken({ req });

        if (!token || (token.role !== 'admin' && needAdmin)) {
          return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
      }
      const { id } = await params;
      const parsedBody = getParams.safeParse({ id });
      if (!parsedBody.success) {
        return NextResponse.json({ message: parsedBody.error.message || "Invalid params" }, { status: 400 });
      }

      const db = await getDb();

      const { result } = await getHandler(db, parsedBody.data as getParams);

      return NextResponse.json({ result, message: `${documentName} retrieved successfully` }, { status: 200 });
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
}

export function createUpdateRoute<updateParams>({
  needAuth,
  needAdmin,
  updateParams,
  updateHandler,
  documentName = "",
}: {
  needAuth: boolean,
  needAdmin: boolean,
  updateParams: z.AnyZodObject,
  updateHandler: (db: Db, params: updateParams) => Promise<{ result: number }>,
  documentName?: string,
}) {
  return async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      if (needAuth) {
        const token = await getToken({ req });

        if (!token || (token.role !== 'admin' && needAdmin)) {
          return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
      }
      const { id } = await params;
      const parsedBody = updateParams.safeParse({ id });
      if (!parsedBody.success) {
        return NextResponse.json({ message: parsedBody.error.message || "Invalid params" }, { status: 400 });
      }

      const db = await getDb();

      const { result } = await updateHandler(db, parsedBody.data as updateParams);

      if (result != 1) {
        return NextResponse.json({ message: `${documentName} not found.` }, { status: 404 });
      }

      return NextResponse.json({ result, message: `${documentName} updated successfully` }, { status: 200 });
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
}

export function createDeleteRoute<deleteParams>({
  needAuth,
  needAdmin,
  deleteParams,
  deleteHandler,
  documentName,
}: {
  needAuth: boolean,
  needAdmin: boolean,
  deleteParams: z.AnyZodObject,
  deleteHandler: (db: Db, params: deleteParams) => Promise<{ result: number }>,
  documentName: string,
}) {
  return async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      if (needAuth) {
        const token = await getToken({ req });

        if (!token || (token.role !== 'admin' && needAdmin)) {
          return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
      }
      const { id } = await params;
      const parsedBody = deleteParams.safeParse({ id });
      if (!parsedBody.success) {
        return NextResponse.json({ message: parsedBody.error.message || "Invalid params" }, { status: 400 });
      }

      const db = await getDb();

      const { result } = await deleteHandler(db, parsedBody.data as deleteParams);

      if (result != 1) {
        return NextResponse.json({ message: `${documentName} not found.` }, { status: 404 });
      }

      return NextResponse.json({ result, message: documentName ? `${documentName} deleted successfully` : 'Item deleted successfully' }, { status: 200 });
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
}

export function createRoute<params, result>({
  params,
  handler,
  success_message,
  needAuth = false,
  needAdmin = false,
  needSearchParams = false,
  useId = false,
  omitResult = false,
}: {
  params: z.AnyZodObject,
  handler: (db: Db, params: params) => Promise<{ result: result }>,
  success_message: string,
  needAuth?: boolean,
  needAdmin?: boolean,
  needSearchParams?: boolean,
  useId?: boolean,
  omitResult?: boolean,
}) {
  return async (req: NextRequest, context?: { params: Promise<{ id: string }> }) => {
    try {
      if (needAuth) {
        const token = await getToken({ req });

        if (!token || (token.role !== 'admin' && needAdmin)) {
          return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
      }

      const { id } = (useId && context) ? await context?.params : { id: "" };
      const searchParams = needSearchParams ? Object.fromEntries(req.nextUrl.searchParams) : {};

      const parsedBody = params.safeParse({ ...searchParams, ...(id ? { id } : {}) });
      if (!parsedBody.success) {
        return NextResponse.json({ message: parsedBody.error.message || "Invalid params" }, { status: 400 });
      }

      const db = await getDb();

      const { result } = await handler(db, parsedBody.data as params);

      if (omitResult) {
        if (result !== 1) {
          return NextResponse.json({ message: "Item not found." }, { status: 404 });
        }
        return NextResponse.json({ message: success_message }, { status: 200 });
      } else {
        return NextResponse.json({ result, message: success_message }, { status: 200 });
      }
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
}