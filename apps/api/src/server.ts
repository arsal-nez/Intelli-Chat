import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { connectDB } from "./database/connection";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./modules/auth/auth.routes";
import eventRoutes from "./modules/events/events.routes";
import rsvpRoutes from "./modules/rsvp/rsvp.routes";
import inviteRoutes from "./modules/invites/invites.routes";
import reminderRoutes from "./modules/reminders/reminders.routes";
import chatRoutes from "./modules/chat/chat.routes";
import { seedEvents } from "./seed";

const app = express();

app.use(cors({ origin: env.WEB_ORIGIN, credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString() } });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/events", rsvpRoutes);
app.use("/api", inviteRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api", reminderRoutes);

app.use(errorHandler);

async function start() {
  await connectDB();
  await seedEvents();
  app.listen(env.PORT, () => {
    console.log(`API running on http://localhost:${env.PORT}`);
  });
}

start();
