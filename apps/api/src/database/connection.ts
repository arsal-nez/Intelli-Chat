import mongoose from "mongoose";
import { env } from "../config/env";

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;
  try {
    await mongoose.connect(env.MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}
