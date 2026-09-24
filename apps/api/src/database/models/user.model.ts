import mongoose, { Schema, Document } from "mongoose";

export interface IUserDoc extends Document {
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string;
  city?: string;
  timezone?: string;
  preferences: {
    categories: string[];
    notificationsEnabled: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    avatarUrl: String,
    city: String,
    timezone: String,
    preferences: {
      categories: { type: [String], default: [] },
      notificationsEnabled: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUserDoc>("User", userSchema);
