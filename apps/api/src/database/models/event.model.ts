import mongoose, { Schema, Document } from "mongoose";

export interface IEventDoc extends Document {
  source: string;
  sourceId: string;
  title: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  ticketUrl?: string;
  venue: {
    name: string;
    address?: string;
    city: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  startTime: Date;
  endTime?: Date;
  timezone?: string;
  status: string;
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEventDoc>(
  {
    source: { type: String, required: true },
    sourceId: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    category: String,
    imageUrl: String,
    ticketUrl: String,
    venue: {
      name: { type: String, required: true },
      address: String,
      city: { type: String, required: true },
      country: String,
      latitude: Number,
      longitude: Number,
    },
    startTime: { type: Date, required: true },
    endTime: Date,
    timezone: String,
    status: { type: String, default: "active" },
    lastSyncedAt: Date,
  },
  { timestamps: true }
);

eventSchema.index({ source: 1, sourceId: 1 }, { unique: true });
eventSchema.index({ startTime: 1 });
eventSchema.index({ "venue.city": 1, startTime: 1 });

export const Event = mongoose.model<IEventDoc>("Event", eventSchema);
