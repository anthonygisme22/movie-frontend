import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null; // Handle missing credentials
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          });

          if (!res.ok) {
            return null; // Handle non-2xx responses
          }

          const user = await res.json();

          if (user && user.token) {
            return {
              email: user.email, // Or whatever properties you need from your API response
              name: user.name, // Add other needed properties
              image: user.image,
              token: user.token, // If you need the token client side. Be careful with security.
              id: user.id
            };
          }

          return null; // Handle cases where the API response doesn't contain a token
        } catch (error) {
          console.error("Error during authentication:", error);
          return null; // Handle fetch errors
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  // Add callbacks, events, pages, etc. as needed
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };