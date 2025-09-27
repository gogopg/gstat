import { Schema, model, models, type InferSchemaType, Types } from "mongoose";

const StatDefinitionSchema = new Schema(
  {
    value: { type: String, required: true },
  },
  { _id: false },
);

const ProfileDefinitionSchema = new Schema(
  {
    id: { type: String, required: true, default: () => new Types.ObjectId().toString() },
    name: { type: String, required: true },
    description: { type: String },
  },
  { _id: false },
);

const PerformancePayloadSchema = new Schema(
  {
    statDefinitions: { type: [StatDefinitionSchema], default: [] },
    performanceRecords: { type: [Schema.Types.Mixed], default: [] },
  },
  { _id: false },
);

const EloRatingSchema = new Schema(
  {
    profileId: { type: String, required: true },
    score: { type: Number, required: true },
  },
  { _id: false },
);

const EloPayloadSchema = new Schema(
  {
    k: { type: Number, required: true },
    bestOf: { type: Number, required: true },
    lastUpdatedAt: { type: Date },
    eloRatings: { type: [EloRatingSchema], default: [] },
  },
  { _id: false },
);

const StatReportSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["performance", "elo"], required: true },
    ownerId: { type: String, required: true, index: true },
    token: { type: String, required: true, unique: true },
    profileDefinitions: { type: [ProfileDefinitionSchema], default: [] },
    performancePayload: { type: PerformancePayloadSchema, default: undefined },
    eloPayload: { type: EloPayloadSchema, default: undefined },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type StatReportDocument = InferSchemaType<typeof StatReportSchema>;

export const StatReportModel =
  models.StatReport ?? model<StatReportDocument>("StatReport", StatReportSchema, "statReport");
