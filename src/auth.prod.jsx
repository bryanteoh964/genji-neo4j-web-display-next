import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "./lib/db.prod";
import Credentials from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import EmailProvider from "next-auth/providers/nodemailer";
import GoogleProvider from "next-auth/providers/google";

// func for email + password login
// check email existence and verify password
async function getUserFromDb(email, password) {
  try {
    const db = await client.db("user");
    const user = await db.collection("info").findOne({ email });

    // verify password    
    if (user && await bcrypt.compare(password, user.password)) {
      return { id: user._id.toString(), email: user.email, name: user.name };
    }
    return null;
  } catch (error) {
    console.error("Error in getUserFromDb:", error);
    return null;
  }
}

// func for google OAuth
async function googleToUserDb(user) {
  try {
    const db = await client.db("user");
    const userInDB = await db.collection("info").findOne({ email: user.email });

    // if email exists, update using google user info
    if(userInDB) {
      await db.collection("info").updateOne(
        {email: user.email}, 
        {$set: { name: user.name}}
      );

      return userInDB._id.toString();
    } else {
      // add new user into db
      const result = await db.collection("info").insertOne({
        email: user.email,
        name: user.name,
        createdAt: new Date()
      });

      return result.insertedId.toString();
    }
  } catch (error) {
    console.error("saving Google user into db has error:", error);
    return null;
  }
}

export const authOptions = {

  adapter: MongoDBAdapter(client),

  providers: [
    // magic link
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    }),

    // google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),

    // email + password
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
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
      if(session.user) {
        session.user.id = token.id;
      }

      return session;
    }
  },
  // pages: {
  //    signIn: '/user', 
  // },
  
  events: {
    // user = {id, name, email, image}
    // account = {provider info}
    // profile = {user info from provider}
    async signIn({ user, account, profile }) {
      try {
  
        if (account?.provider === 'google') {
          const userId = await googleToUserDb(user);
          
          if (userId) {
            user.id = userId;
          }
        }
      } catch (error) {
        console.error("Error in signIn event:", error);
      }
    },
  },
}

const { handlers, auth, signIn, signOut } = NextAuth(authOptions)

export { handlers, auth, signIn, signOut }