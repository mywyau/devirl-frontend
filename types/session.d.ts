// types/session.d.ts (or any global types file)
import type { IronSessionData } from "iron-session";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      sub: string;
      name?: string;
      email?: string;
      picture?: string;
      [key: string]: any;
    };
  }
}
