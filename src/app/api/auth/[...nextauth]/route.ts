import NextAuth from "next-auth";
import { authConfig } from "@/auth"; // você já criou esse arquivo

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
