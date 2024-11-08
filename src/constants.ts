import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

export const JWT_SECRET = process.env.JWT_SECRET || "";
export const MONGO_USER = process.env.MONGO_USER || "";
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
export const MONGO_HOST = process.env.MONGO_HOST || "";
export const MONGO_OPTIONS = process.env.MONGO_OPTIONS || "";
export const MONGO_DB = process.env.MONGO_DB || "";
export const VTEX_API_URL = process.env.VTEX_API_URL || "";
export const VTEX_API_SEARCH_PATH = process.env.VTEX_API_SEARCH_PATH || "";
