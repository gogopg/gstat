import mongoose from "mongoose";

// Reuse connection across hot reloads in Next.js
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

let cached = globalThis._mongooseCache;
if (!cached) {
  cached = { conn: null, promise: null };
  globalThis._mongooseCache = cached;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI 환경 변수가 설정되어 있지 않습니다.");
    }

    cached.promise = mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
