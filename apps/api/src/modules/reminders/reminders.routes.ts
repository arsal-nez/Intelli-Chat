import { Router, Response } from "express";
import { Reminder } from "../../database/models/reminder.model";
import { Event } from "../../database/models/event.model";
import { authenticate, AuthRequest } from "../../middleware/auth";

const router = Router();

router.post("/events/:eventId/reminders", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { eventId } = req.params;
    const userId = req.userId!;
    const { reminderTime } = req.body;
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ success: false, error: { code: "EVENT_NOT_FOUND", message: "Event not found" } });
      return;
    }
    const reminder = await Reminder.create({ userId, eventId, reminderTime: new Date(reminderTime) });
    res.status(201).json({ success: true, data: reminder });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: "INTERNAL", message: err.message } });
  }
});

router.get("/me/reminders", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const reminders = await Reminder.find({ userId: req.userId, status: "pending" })
      .populate("eventId")
      .sort({ reminderTime: 1 });
    res.json({ success: true, data: reminders });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: "INTERNAL", message: err.message } });
  }
});

export default router;
