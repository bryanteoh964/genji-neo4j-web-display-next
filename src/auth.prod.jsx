import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "./lib/db.prod"
import Credentials from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'


async function getUserFromDb(email, password) {
  try {
    const db = await client.db("user");
    const user = await db.collection("info").findOne({ email });
    
    if (user && await bcrypt.compare(password, user.password)) {
      return { id: user._id.toString(), email: user.email, name: user.name };
    }
    return null;
  } catch (error) {
    console.error("Error in getUserFromDb:", error);
    return null;
  }
}

const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password");
          return null;
        }

        try {
          // logic to verify if the user exists
          const user = await getUserFromDb(credentials.email, credentials.password);
 
          if (!user) {
            // No user found, so this is their first attempt to login
            // meaning this is also the place you could do registration
            console.log("User not found");
            return null;
          }
          // return user object with their profile data
          return user;
        } catch (e) {
          console.error("Error in authorize function:", e);
          return null;
        }
      }  
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    }
  },
  pages: {
    signIn: '/test', 
  },
})

export { handlers, auth, signIn, signOut }