import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// This configuration is just an example. You can integrate your own backend APIs
// for user authentication and email verification as needed.
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Call your backend API to verify the credentials
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
          method: 'POST',
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          headers: { "Content-Type": "application/json" }
        });
        const user = await res.json();
        if (res.ok && user.token) {
          return user;
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  // You can add callbacks, events, pages, etc.
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
