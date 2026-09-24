import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { User } from "../../database/models/user.model";
import { authenticate, AuthRequest } from "../../middleware/auth";

const router = Router();

function signTokens(userId: string) {
  const accessToken = jwt.sign({ userId }, env.JWT_ACCESS_SECRET, { expiresIn: "1d" });
  const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
}

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ success: false, error: { code: "VALIDATION", message: "name, email, password required" } });
      return;
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ success: false, error: { code: "DUPLICATE_EMAIL", message: "Email already registered" } });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: email.toLowerCase(), passwordHash });
    const tokens = signTokens(user._id.toString());
    res.status(201).json({
      success: true,
      data: { user: { _id: user._id, name: user.name, email: user.email }, ...tokens },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: "INTERNAL", message: err.message } });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: { code: "VALIDATION", message: "email, password required" } });
      return;
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
      return;
    }
    const tokens = signTokens(user._id.toString());
    res.json({
      success: true,
      data: { user: { _id: user._id, name: user.name, email: user.email }, ...tokens },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: "INTERNAL", message: err.message } });
  }
});

router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash");
    if (!user) {
      res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "User not found" } });
      return;
    }
    res.json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: "INTERNAL", message: err.message } });
  }
});

export default router;
