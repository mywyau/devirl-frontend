// types/session.d.ts (or any global types file)
import type { IronSessionData } from "iron-session";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      name: string;
      email: string;
      sub: string;
    };
  }
}
