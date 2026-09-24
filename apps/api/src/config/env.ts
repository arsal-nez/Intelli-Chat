import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "4000", 10),
  WEB_ORIGIN: process.env.WEB_ORIGIN || "http://localhost:3000",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/eventflow",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "dev-access-secret",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "dev-refresh-secret",
  TICKETMASTER_API_KEY: process.env.TICKETMASTER_API_KEY || "",
  LLM_API_KEY: process.env.LLM_API_KEY || "",
};
