export type TokenPayload = {
  userId: string;
  role: "ADMIN" | "USER";
  email?: string;
  permissions?: string[];
  iat?: number;
  exp?: number;
  [key: string]: unknown;
};