import mongoose, { Schema, Document } from "mongoose";

export interface IInviteLinkDoc extends Document {
  token: string;
  eventId: mongoose.Types.ObjectId;
  ownerUserId: mongoose.Types.ObjectId;
  clickCount: number;
  uniqueClickCount: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const inviteLinkSchema = new Schema<IInviteLinkDoc>(
  {
    token: { type: String, required: true, unique: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    ownerUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    clickCount: { type: Number, default: 0 },
    uniqueClickCount: { type: Number, default: 0 },
    expiresAt: Date,
  },
  { timestamps: true }
);

inviteLinkSchema.index({ ownerUserId: 1, eventId: 1 });

export const InviteLink = mongoose.model<IInviteLinkDoc>("InviteLink", inviteLinkSchema);
