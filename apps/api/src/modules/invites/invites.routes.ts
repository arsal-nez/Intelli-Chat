import { Router, Request, Response } from "express";
import crypto from "crypto";
import { InviteLink } from "../../database/models/invite.model";
import { RSVP } from "../../database/models/rsvp.model";
import { Event } from "../../database/models/event.model";
import { authenticate, AuthRequest } from "../../middleware/auth";

const router = Router();

router.post("/events/:eventId/invites", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { eventId } = req.params;
    const userId = req.userId!;
    const rsvp = await RSVP.findOne({ userId, eventId, status: "confirmed" });
    if (!rsvp) {
      res.status(403).json({ success: false, error: { code: "NO_RSVP", message: "You must RSVP before inviting friends" } });
      return;
    }
    const existing = await InviteLink.findOne({ ownerUserId: userId, eventId });
    if (existing) {
      res.json({ success: true, data: existing, message: "Invite link already exists" });
      return;
    }
    const token = crypto.randomBytes(32).toString("hex");
    const invite = await InviteLink.create({ token, eventId, ownerUserId: userId });
    res.status(201).json({ success: true, data: invite });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: "INTERNAL", message: err.message } });
  }
});

router.get("/invites/:token", async (req: Request, res: Response) => {
  try {
    const invite = await InviteLink.findOne({ token: req.params.token });
    if (!invite) {
      res.status(404).json({ success: false, error: { code: "INVITE_NOT_FOUND", message: "Invite not found" } });
      return;
    }
    invite.clickCount += 1;
    await invite.save();
    const event = await Event.findById(invite.eventId);
    res.json({ success: true, data: { invite, event } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: "INTERNAL", message: err.message } });
  }
});

router.post("/invites/:token/rsvp", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const invite = await InviteLink.findOne({ token: req.params.token });
    if (!invite) {
      res.status(404).json({ success: false, error: { code: "INVITE_NOT_FOUND", message: "Invite not found" } });
      return;
    }
    const userId = req.userId!;
    if (userId === invite.ownerUserId.toString()) {
      res.status(400).json({ success: false, error: { code: "SELF_INVITE", message: "Cannot accept your own invite" } });
      return;
    }
    const existing = await RSVP.findOne({ userId, eventId: invite.eventId });
    if (existing && existing.status === "confirmed") {
      res.json({ success: true, data: existing, message: "Already RSVPed" });
      return;
    }
    if (existing && existing.status === "cancelled") {
      existing.status = "confirmed";
      existing.inviteId = invite._id as any;
      existing.referredByUserId = invite.ownerUserId;
      await existing.save();
      res.json({ success: true, data: existing });
      return;
    }
    const rsvp = await RSVP.create({
      userId,
      eventId: invite.eventId,
      status: "confirmed",
      inviteId: invite._id,
      referredByUserId: invite.ownerUserId,
    });
    res.status(201).json({ success: true, data: rsvp });
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(409).json({ success: false, error: { code: "DUPLICATE_RSVP", message: "Already RSVPed" } });
      return;
    }
    res.status(500).json({ success: false, error: { code: "INTERNAL", message: err.message } });
  }
});

router.get("/events/:eventId/invites/stats", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { eventId } = req.params;
    const userId = req.userId!;
    const invite = await InviteLink.findOne({ ownerUserId: userId, eventId });
    if (!invite) {
      res.json({ success: true, data: { clickCount: 0, friendCount: 0 } });
      return;
    }
    const friendCount = await RSVP.countDocuments({
      eventId,
      referredByUserId: userId,
      status: "confirmed",
    });
    res.json({
      success: true,
      data: {
        token: invite.token,
        clickCount: invite.clickCount,
        friendCount,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: "INTERNAL", message: err.message } });
  }
});

export default router;
