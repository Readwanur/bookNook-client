import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);
const db = client.db();

const cleanBaseUrl = process.env.BETTER_AUTH_URL
  ? process.env.BETTER_AUTH_URL.replace(/\/+$/, "")
  : undefined;

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 6,
  },
  baseURL: cleanBaseUrl,
  trustedOrigins: [
    process.env.BETTER_AUTH_URL as string,
    ...(cleanBaseUrl ? [cleanBaseUrl] : []),
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
