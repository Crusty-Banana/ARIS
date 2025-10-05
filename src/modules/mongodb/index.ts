"use server";

// import { initializeIndices } from "kreate-server/db/initData";
import { MongoClient, Db } from "mongodb";

import { SERVER_ENV } from "../env/server";

// When running `yarn dev`, anytime a compilation is triggered, a new connection
// is created, without closing the previous one.
// Reference: https://github.com/vercel/next.js/issues/7811#issuecomment-618425485

type Data = {
  uri: string;
  clientPromise: Promise<MongoClient>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isData(value: any): value is Data {
  return (
    typeof value?.uri === "string" &&
    typeof value?.clientPromise?.then === "function"
  );
}

function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) throw new Error(message);
}

/** Loads `Data` from `global` */
function getData(): Data | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = (global as any)?.__MONGO_DB_CONNECTION_DATA__;
  return isData(result) ? result : undefined;
}

/** Saves `Data` to `global` */
function setData(value: Data | undefined) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).__MONGO_DB_CONNECTION_DATA__ = value;
}

/** Connects to DB and saves `data` to `global` accordingly. */
async function connect(uri: string): Promise<MongoClient> {
  let data = getData();
  assert(!data, "cannot call connect() when data exists");
  console.log("connecting to: " + uri);
  data = {
    uri,
    clientPromise: MongoClient.connect(uri),
  };
  setData(data);
  // run initialize database
  const db = (await data.clientPromise).db(SERVER_ENV.MONGODB_DBNAME);
  await initializeIndices(db);
  return await data.clientPromise;
}

/** Disconnects from DB and unsets `data` in `global` accordingly */
async function disconnect() {
  const data = getData();
  assert(data, "cannot call disconnect() when data does not exists");
  if (!data) return;
  console.log("disconnecting from: " + data.uri);
  setData(undefined);
  (await data.clientPromise).close();
}

/** Returns `MongoClient` given a connection URI */
export async function getClient(): Promise<MongoClient> {
  const data = getData();
  if (!data) {
    return await connect(SERVER_ENV.MONGODB_URI);
  } else if (data.uri !== SERVER_ENV.MONGODB_URI) {
    console.log("uri changed, reconnecting...");
    await disconnect();
    return await connect(SERVER_ENV.MONGODB_URI);
  } else {
    return await data.clientPromise;
  }
}

/** Returns `Db` using the default connection URI */
export async function getDb(): Promise<Db> {
  const client = await getClient();
  const db = client.db(SERVER_ENV.MONGODB_DBNAME);
  return db;
}

export async function initializeIndices(db: Db) {
  if (db) {
  }
  // TODO: handle db
}
