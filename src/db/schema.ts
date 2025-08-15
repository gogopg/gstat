import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { sqliteTable, integer, text as sqliteText } from 'drizzle-orm/sqlite-core';

// PostgreSQL 스키마
export const pgUsers = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').unique().notNull(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// SQLite 스키마
export const sqliteUsers = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: sqliteText('username').unique().notNull(),
  email: sqliteText('email').unique().notNull(),
  passwordHash: sqliteText('password_hash').notNull(),
  createdAt: sqliteText('created_at').notNull(),
});

// 환경에 따라 적절한 스키마 선택
const useSqlite = !process.env.DATABASE_URL || process.env.NODE_ENV === "development";
export const users = useSqlite ? sqliteUsers : pgUsers;
