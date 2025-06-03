// types/iron-session.d.ts
import "iron-session";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      email: string;
      given_name: string;
      family_name: string;
      sub: string;
      [key: string]: any; // add other Auth0 fields if needed
    };
  }
}
