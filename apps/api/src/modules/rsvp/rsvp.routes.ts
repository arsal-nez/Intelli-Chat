import { Router, Response } from "express";
import { RSVP } from "../../database/models/rsvp.model";
import { Event } from "../../database/models/event.model";
import { authenticate, AuthRequest } from "../../middleware/auth";

const router = Router();

router.post("/:eventId/rsvp", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { eventId } = req.params;
    const userId = req.userId!;
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ success: false, error: { code: "EVENT_NOT_FOUND", message: "Event not found" } });
      return;
    }
    const existing = await RSVP.findOne({ userId, eventId });
    if (existing && existing.status === "confirmed") {
      res.json({ success: true, data: existing, message: "Already RSVPed" });
      return;
    }
    if (existing && existing.status === "cancelled") {
      existing.status = "confirmed";
      await existing.save();
      res.json({ success: true, data: existing, message: "RSVP reconfirmed" });
      return;
    }
    const rsvp = await RSVP.create({ userId, eventId, status: "confirmed" });
    res.status(201).json({ success: true, data: rsvp });
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(409).json({ success: false, error: { code: "DUPLICATE_RSVP", message: "Already RSVPed" } });
      return;
    }
    res.status(500).json({ success: false, error: { code: "INTERNAL", message: err.message } });
  }
});

router.delete("/:eventId/rsvp", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { eventId } = req.params;
    const userId = req.userId!;
    const rsvp = await RSVP.findOne({ userId, eventId });
    if (!rsvp) {
      res.status(404).json({ success: false, error: { code: "RSVP_NOT_FOUND", message: "No RSVP found" } });
      return;
    }
    rsvp.status = "cancelled";
    await rsvp.save();
    res.json({ success: true, data: rsvp, message: "RSVP cancelled" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: "INTERNAL", message: err.message } });
  }
});

router.get("/me/rsvps", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const rsvps = await RSVP.find({ userId: req.userId, status: "confirmed" }).populate("eventId");
    res.json({ success: true, data: rsvps });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: "INTERNAL", message: err.message } });
  }
});

export default router;
