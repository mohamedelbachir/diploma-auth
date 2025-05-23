import { accoutType } from "@/types/type";
import { SessionOptions } from "iron-session";

export interface SessionData {
  user: {
    id: number,
   username: string,
   email: string,
   first_name: string,
   last_name: string,
   role: "student"|"admin",
   is_superuser: boolean,
   is_staff: boolean,
   date_joined: Date,
   last_login: Date|null,
    token:string
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
