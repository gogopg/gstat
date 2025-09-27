import { Schema, model, models, type InferSchemaType } from "mongoose";

const MatchParticipantSchema = new Schema(
  {
    profileId: { type: String, required: true },
    profileName: { type: String, required: true },
  },
  { _id: false },
);

const MatchRosterSchema = new Schema(
  {
    A: { type: [String], default: undefined },
    B: { type: [String], default: undefined },
  },
  { _id: false },
);

const SetResultSchema = new Schema(
  {
    A: { type: Number, required: true },
    B: { type: Number, required: true },
  },
  { _id: false },
);

const MatchRecordSchema = new Schema(
  {
    reportToken: { type: String, required: true, index: true },
    matchId: { type: String, required: true },
    name: { type: String },
    participants: {
      A: { type: MatchParticipantSchema, required: true },
      B: { type: MatchParticipantSchema, required: true },
    },
    setResult: { type: SetResultSchema, required: true },
    matchDate: { type: Date, required: true },
    createdAt: { type: Date, required: true },
    roster: { type: MatchRosterSchema, default: undefined },
    winnerSide: { type: String, enum: ["A", "B"], required: true },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

MatchRecordSchema.index({ reportToken: 1, matchId: 1 }, { unique: true });
MatchRecordSchema.index({ reportToken: 1, matchDate: 1 });

export type MatchRecordDocument = InferSchemaType<typeof MatchRecordSchema>;

export const MatchRecordModel =
  models.MatchRecord ?? model<MatchRecordDocument>("MatchRecord", MatchRecordSchema, "matchRecord");
