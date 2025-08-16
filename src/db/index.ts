import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
// schema.ts 파일에서 PostgreSQL users 스키마(pgUsers)를 가져옵니다.
import { pgUsers } from "@/db/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// route.ts에서 직접 import할 수 있도록 pgUsers를 'users'라는 이름으로 export합니다.
export const users = pgUsers;

export const db = drizzle(pool, {
  schema: { users: pgUsers }, // Drizzle ORM 내부 스키마에는 pgUsers를 'users'로 연결합니다.
});
