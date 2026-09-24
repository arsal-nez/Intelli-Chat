import mongoose, { Schema, Document } from "mongoose";

export interface IReminderDoc extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  reminderTime: Date;
  status: "pending" | "sent" | "cancelled";
  createdAt: Date;
}

const reminderSchema = new Schema<IReminderDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    reminderTime: { type: Date, required: true },
    status: { type: String, enum: ["pending", "sent", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

export const Reminder = mongoose.model<IReminderDoc>("Reminder", reminderSchema);
