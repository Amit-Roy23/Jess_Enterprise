import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: "admin" | "editor" | string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role?: "admin" | "editor" | string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "admin" | "editor" | string;
  }
}
