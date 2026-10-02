import dns from "node:dns";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI");
}

const mongoUri: string = MONGODB_URI;
const MAX_CONNECT_ATTEMPTS = 2;
const mongoDnsServers = process.env.MONGODB_DNS_SERVERS
  ?.split(",")
  .map((server) => server.trim())
  .filter(Boolean);

if (mongoUri.startsWith("mongodb+srv://") && mongoDnsServers?.length) {
  dns.setServers(mongoDnsServers);
}

export class DatabaseConnectionError extends Error {
  constructor(options?: ErrorOptions) {
    super("ไม่สามารถเชื่อมต่อฐานข้อมูลได้ในขณะนี้", options);
    this.name = "DatabaseConnectionError";
  }
}

const cached = global as typeof global & {
  mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

if (!cached.mongoose) {
  cached.mongoose = {
    conn: null,
    promise: null,
  };
}

const mongooseCache = cached.mongoose;

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function createConnection() {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_CONNECT_ATTEMPTS; attempt += 1) {
    try {
      return await mongoose.connect(mongoUri, {
        bufferCommands: false,
        connectTimeoutMS: 10000,
        serverSelectionTimeoutMS: 10000,
      });
    } catch (error) {
      lastError = error;
      if (attempt < MAX_CONNECT_ATTEMPTS) {
        await wait(attempt * 500);
      }
    }
  }

  throw new DatabaseConnectionError({ cause: lastError });
}

export async function connectDB() {
  if (mongooseCache.conn) {
    return mongooseCache.conn;
  }

  if (!mongooseCache.promise) {
    mongooseCache.promise = createConnection();
  }

  try {
    mongooseCache.conn = await mongooseCache.promise;
  } catch (error) {
    // A rejected promise must not poison every request until the dev server restarts.
    mongooseCache.conn = null;
    mongooseCache.promise = null;
    throw error;
  }

  return mongooseCache.conn;
}
