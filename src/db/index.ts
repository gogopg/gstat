import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  statReportsSchema,
  usersSchema,
  eloPayloadSchema,
  performancePayloadSchema,
  profileDefinitionsSchema,
} from "@/db/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: {
    users: usersSchema,
    reports: statReportsSchema,
    eloPayload: eloPayloadSchema,
    performancePayload: performancePayloadSchema,
    profileDefinition: profileDefinitionsSchema,
  },
});
