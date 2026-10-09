import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/lib/auth.config";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models";
import { loginSchema } from "@/lib/validators";

/** Lets the login page tell "wrong password" apart from "database unreachable". */
class DatabaseUnavailable extends CredentialsSignin {
  code = "database";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validated = loginSchema.safeParse(credentials);
        if (!validated.success) {
          return null;
        }

        const { email, password } = validated.data;

        try {
          await connectDB();
        } catch (err) {
          console.error("[auth] Database unavailable during login:", err);
          throw new DatabaseUnavailable();
        }
        const user = await AdminUser.findOne({
          email: email.toLowerCase().trim(),
        });

        if (!user) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!isValidPassword) {
          return null;
        }

        // Update last login timestamp
        user.lastLoginAt = new Date();
        await user.save();

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
});
