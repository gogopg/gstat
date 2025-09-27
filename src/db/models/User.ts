import { randomUUID } from "crypto";
import { Schema, model, models, type InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, default: () => randomUUID() },
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

export type UserDocument = InferSchemaType<typeof UserSchema>;

export const UserModel = models.User ?? model<UserDocument>("User", UserSchema, "user");
