import { integer, json, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { PerformanceRecord, StatDefinition } from "@/types/report";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 100 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const statReports = pgTable("stat_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  ownerId: uuid("owner_id").notNull(),
  token: varchar("share_token", { length: 12 }).unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});

export const profileDefinitions = pgTable("profile_definitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }),
  reportId: uuid("report_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const performancePayload = pgTable("performance_payload", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id").unique().notNull().references(() => statReports.id),
  statDefinitions: json("stat_definitions").$type<StatDefinition[]>().notNull(),
  performanceRecords: json("performance_records").$type<PerformanceRecord[]>().notNull(),
  createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
});

export const eloPayload = pgTable("elo_payload", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id").notNull().unique(),
  k: integer("k").notNull(),
  bestOf: integer("best_of").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const matchRecords = pgTable("match_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }),
  matchDate: timestamp("match_date").notNull(),
  winnerSide: varchar("winner_side", { length: 1 }).notNull(),
  participantAId: uuid("participant_a_id").notNull(),
  participantBId: uuid("participant_b_id").notNull(),
  setResultA: integer("set_result_a").notNull(),
  setResultB: integer("set_result_b").notNull(),
  eloPayloadId: uuid("elo_payload_id").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const eloRatings = pgTable("elo_ratings", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id").notNull(),
  score: integer("score").notNull(),
  eloPayloadId: uuid("elo_payload_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});

export const schema = {
  users,
  statReports,
  profileDefinitions,
  performancePayload,
  eloPayload,
  matchRecords,
  eloRatings,
} as const;
export type DBSchema = typeof schema;