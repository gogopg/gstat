import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" }); // DATABASE_URL 로드

export default {
  schema: "./src/db/schema.ts", // PostgreSQL 테이블 정의가 있는 파일 경로
  out: "./drizzle",
  dialect: "postgresql", // <-- 필수 (기존 driver: "pg" 제거)
  dbCredentials: {
    url: process.env.DATABASE_URL!, // <-- 최신 키는 url
  },
  strict: true,
} satisfies Config;
