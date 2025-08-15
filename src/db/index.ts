import * as schema from "./schema";
import Database from "better-sqlite3";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// 라우트에서 실제로 사용하는 최소 공통 인터페이스
interface InsertBuilder {
  values: (vals: Record<string, unknown>) => Promise<unknown> | unknown;
}
interface DrizzleDbLike {
  insert: (table: unknown) => InsertBuilder;
}

let dbInstance: DrizzleDbLike | null = null;

const useSqlite =
  !process.env.DATABASE_URL || process.env.NODE_ENV === "development";

async function initializeDb(): Promise<DrizzleDbLike> {
  if (dbInstance) {
    return dbInstance;
  }

  if (useSqlite) {
    const sqlite = new Database(":memory:");

    // 개발용 인메모리 테이블 준비
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);

    const sqliteDb = drizzleSqlite(sqlite, {
      schema: {
        users: schema.sqliteUsers,
      },
    });

    // 최소 공통 인터페이스로 래핑
    dbInstance = {
      insert: (table: unknown) => sqliteDb.insert(table as never) as unknown as InsertBuilder,
    };
  } else {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const pgDb = drizzlePg(pool, {
      schema: {
        users: schema.pgUsers,
      },
    });

    // 최소 공통 인터페이스로 래핑
    dbInstance = {
      insert: (table: unknown) => pgDb.insert(table as never) as unknown as InsertBuilder,
    };
  }

  return dbInstance;
}

export async function getDb(): Promise<DrizzleDbLike> {
  return initializeDb();
}

// 필요 시 비동기 접근 헬퍼
export const db = {
  get: () => initializeDb(),
};
