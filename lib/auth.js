import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUsersCollection } from "@/lib/db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Test Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (
          credentials?.username === "razorpay-test@dsatracker.pro" &&
          credentials?.password === "ReviewPassword2026!"
        ) {
          return {
            id: "razorpay_reviewer",
            name: "Razorpay Reviewer",
            email: "razorpay-test@dsatracker.pro",
            image: "https://lh3.googleusercontent.com/a/default-user=s96-c"
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const usersCol = await getUsersCollection();
        const userDoc = await usersCol.findOne({ _id: user.id });
        
        const adminEmails = ["harshagrawal4256@gmail.com"];
        const isInitialAdmin = user.email ? adminEmails.includes(user.email.toLowerCase()) : false;
        
        if (!userDoc) {
          await usersCol.updateOne(
            { _id: user.id },
            {
              $set: {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                role: isInitialAdmin ? "admin" : "user",
                isPaid: isInitialAdmin ? true : false,
                createdAt: new Date().toISOString(),
                schedule: { type: "3month", startDate: new Date().toISOString().split("T")[0] }
              }
            },
            { upsert: true }
          );
        } else {
          const newRole = isInitialAdmin ? "admin" : (userDoc.role || "user");
          const newIsPaid = isInitialAdmin ? true : (userDoc.isPaid || false);
          
          await usersCol.updateOne(
            { _id: user.id },
            {
              $set: {
                name: user.name,
                image: user.image,
                role: newRole,
                isPaid: newIsPaid
              }
            }
          );
        }
      } catch (error) {
        console.error("Error during signIn callback in MongoDB: ", error);
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      
      const adminEmails = ["harshagrawal4256@gmail.com"];
      const isInitialAdmin = token.email ? adminEmails.includes(token.email.toLowerCase()) : false;
      const isReviewer = token.email === "razorpay-test@dsatracker.pro";
      
      if (isInitialAdmin) {
        token.role = "admin";
        token.isPaid = true;
      } else if (isReviewer) {
        token.role = "user";
        token.isPaid = false;
        token.picture = "https://lh3.googleusercontent.com/a/default-user=s96-c";
      } else if (token.id) {
        try {
          const usersCol = await getUsersCollection();
          const userDoc = await usersCol.findOne({ _id: token.id });
          if (userDoc) {
            token.role = userDoc.role || "user";
            token.isPaid = userDoc.isPaid || false;
            token.schedule = userDoc.schedule || null;
            
            // Safety cleaning for gravatar hostnames
            if (userDoc.image && userDoc.image.includes("gravatar.com")) {
              token.picture = "https://lh3.googleusercontent.com/a/default-user=s96-c";
            } else {
              token.picture = userDoc.image || null;
            }
          }
        } catch (error) {
          console.error("Error fetching user data in JWT callback:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role || "user";
        session.user.isPaid = token.isPaid || false;
        session.user.schedule = token.schedule || null;
        
        // Clean unconfigured image domains from active browser sessions
        if (token.picture && token.picture.includes("gravatar.com")) {
          session.user.image = "https://lh3.googleusercontent.com/a/default-user=s96-c";
        } else {
          session.user.image = token.picture || "https://lh3.googleusercontent.com/a/default-user=s96-c";
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};
