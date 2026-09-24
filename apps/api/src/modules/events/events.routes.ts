import { Router, Request, Response } from "express";
import { Event } from "../../database/models/event.model";
import { authenticate, AuthRequest } from "../../middleware/auth";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { keyword, category, city, startDate, endDate, page = "1", limit = "20" } = req.query;
    const filter: any = { status: "active" };
    if (keyword) filter.title = { $regex: keyword, $options: "i" };
    if (category) filter.category = { $regex: category, $options: "i" };
    if (city) filter["venue.city"] = { $regex: city, $options: "i" };
    if (startDate || endDate) {
      filter.startTime = {};
      if (startDate) filter.startTime.$gte = new Date(startDate as string);
      if (endDate) filter.startTime.$lte = new Date(endDate as string);
    }
    const pageNum = Math.max(1, parseInt(page as string));
    const lim = Math.min(50, parseInt(limit as string));
    const events = await Event.find(filter)
      .sort({ startTime: 1 })
      .skip((pageNum - 1) * lim)
      .limit(lim);
    const total = await Event.countDocuments(filter);
    res.json({ success: true, data: { events, total, page: pageNum, totalPages: Math.ceil(total / lim) } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: "INTERNAL", message: err.message } });
  }
});

router.get("/calendar", async (req: Request, res: Response) => {
  try {
    const { month, year } = req.query;
    const y = parseInt(year as string) || new Date().getFullYear();
    const m = parseInt(month as string) || new Date().getMonth() + 1;
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0, 23, 59, 59);
    const events = await Event.find({
      startTime: { $gte: start, $lte: end },
      status: "active",
    }).sort({ startTime: 1 });
    res.json({ success: true, data: events });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: "INTERNAL", message: err.message } });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ success: false, error: { code: "EVENT_NOT_FOUND", message: "Event not found" } });
      return;
    }
    res.json({ success: true, data: event });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: "INTERNAL", message: err.message } });
  }
});

export default router;
