import { integer, json, pgTable, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const usersSchema = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 100 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const statReportsSchema = pgTable("stat_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  payloadId: uuid("payload_id").notNull(),
  ownerId: uuid("owner_id").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const profileDefinitionsSchema = pgTable("profile_definitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }),
  reportId: uuid("report_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const performancePayloadSchema = pgTable("performance_payload", {
  id: uuid("id").primaryKey().defaultRandom(),
  statDefinitions: json("stat_definitions").notNull(),
  performanceRecords: json("performance_records").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eloPayloadSchema = pgTable("elo_payload", {
  id: uuid("id").primaryKey().defaultRandom(),
  k: integer("k").notNull(),
  bestOf: integer("best_of").notNull(),
  lastUpdatedAt: varchar("last_updated_at", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const matchRecordsSchema = pgTable("match_records", {
  id: uuid("id").primaryKey(),
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

export const eloRatingsSchema = pgTable("elo_ratings", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id").notNull(),
  score: integer("score").notNull(),
  eloPayloadId: uuid("elo_payload_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
