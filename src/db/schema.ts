import { integer, json, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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
  payloadId: uuid("payload_id"),
  ownerId: uuid("owner_id").notNull(),
  token: varchar("share_token", { length: 12 }).unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
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
  updatedAt: timestamp("updated_at"),
});

export const statReportsRelations = relations(statReportsSchema, ({ one, many }) => ({
  owner: one(usersSchema, {
    fields: [statReportsSchema.ownerId],
    references: [usersSchema.id],
  }),
  profileDefinitions: many(profileDefinitionsSchema),
  performancePayload: one(performancePayloadSchema, {
    fields: [statReportsSchema.payloadId],
    references: [performancePayloadSchema.id],
  }),
  eloPayload: one(eloPayloadSchema, {
    fields: [statReportsSchema.payloadId],
    references: [eloPayloadSchema.id],
  }),
}));

export const profileDefinitionsRelations = relations(profileDefinitionsSchema, ({ one }) => ({
  report: one(statReportsSchema, {
    fields: [profileDefinitionsSchema.reportId],
    references: [statReportsSchema.id],
  }),
}));

export const performancePayloadRelations = relations(performancePayloadSchema, ({ one }) => ({
  report: one(statReportsSchema, {
    fields: [performancePayloadSchema.id],
    references: [statReportsSchema.payloadId],
  }),
}));

export const eloPayloadRelations = relations(eloPayloadSchema, ({ one, many }) => ({
  report: one(statReportsSchema, {
    fields: [eloPayloadSchema.id],
    references: [statReportsSchema.payloadId],
  }),
  matchRecords: many(matchRecordsSchema),
  eloRatings: many(eloRatingsSchema),
}));

export const matchRecordsRelations = relations(matchRecordsSchema, ({ one }) => ({
  eloPayload: one(eloPayloadSchema, {
    fields: [matchRecordsSchema.eloPayloadId],
    references: [eloPayloadSchema.id],
  }),
}));

export const eloRatingsRelations = relations(eloRatingsSchema, ({ one }) => ({
  eloPayload: one(eloPayloadSchema, {
    fields: [eloRatingsSchema.eloPayloadId],
    references: [eloPayloadSchema.id],
  }),
}));