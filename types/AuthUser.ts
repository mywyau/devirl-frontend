export interface AuthUser {
  email: string;
  given_name: string;
  family_name: string;
  sub: string;
  nickname?: string;
  picture?: string;
  locale?: string;
  // [key: string]: any; // to allow any additional Auth0 profile fields
}