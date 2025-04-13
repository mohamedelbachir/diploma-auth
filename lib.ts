import { accoutType } from "@/types/type";
import { SessionOptions } from "iron-session";

export interface SessionData {
  user: {
    userId?: string;
    username?: string;
  } | null
}

export const defaultSession: SessionData = {
  user: null,
};
export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_KEY!,
  cookieName: "session-connect",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};
