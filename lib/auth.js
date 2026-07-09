import GoogleProvider from "next-auth/providers/google";
import { getUsersCollection } from "@/lib/db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const usersCol = await getUsersCollection();
        const userDoc = await usersCol.findOne({ _id: user.id });
        
        const adminEmails = ["harshagrawal4256@gmail.com"];
        const isInitialAdmin = adminEmails.includes(user.email);
        
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
      }
      
      if (token.id) {
        try {
          const usersCol = await getUsersCollection();
          const userDoc = await usersCol.findOne({ _id: token.id });
          if (userDoc) {
            token.role = userDoc.role || "user";
            token.isPaid = userDoc.isPaid || false;
            token.schedule = userDoc.schedule || null;
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
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};
