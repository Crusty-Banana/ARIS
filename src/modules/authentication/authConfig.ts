import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getDb } from "../mongodb";
import { compare } from "bcryptjs";

const db = await getDb();
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await db
          .collection("users")
          .findOne({ email: credentials.email });

        if (user && (await compare(credentials.password, user.password))) {
          if (!user.emailVerified) {
            throw new Error("EmailNotVerified");
          }
          return {
            id: user._id.toHexString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};
