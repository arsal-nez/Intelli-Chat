import mongoose, { Schema, Document } from "mongoose";

export interface IRSVPDoc extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  status: "confirmed" | "cancelled";
  inviteId?: mongoose.Types.ObjectId | null;
  referredByUserId?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const rsvpSchema = new Schema<IRSVPDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
    inviteId: { type: Schema.Types.ObjectId, ref: "InviteLink", default: null },
    referredByUserId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

rsvpSchema.index({ userId: 1, eventId: 1 }, { unique: true });
rsvpSchema.index({ eventId: 1, status: 1 });
rsvpSchema.index({ referredByUserId: 1, eventId: 1, status: 1 });

export const RSVP = mongoose.model<IRSVPDoc>("RSVP", rsvpSchema);
