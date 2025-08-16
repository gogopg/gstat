import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { usersSchema } from "@/db/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// users라는 이름으로 re-export
export const users = usersSchema;

export const db = drizzle(pool, {
  schema: { users: usersSchema },
});
