export interface SessionData {
  user?: {
    email: string;
    given_name: string;
    family_name: string;
    sub: string;
    [key: string]: any;
  };
}
