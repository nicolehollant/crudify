import NextAuth, { DefaultSession } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";

// Prisma adapter for NextAuth, optional and can be removed
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import EmailProvider from "next-auth/providers/email";
import { mongoClient, Accounts } from "@server/db";

export default NextAuth({
  // Configure one or more authentication providers
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
  },
  adapter: MongoDBAdapter(mongoClient.connect()),
  callbacks: {
    session: async ({ session, token, user }) => {
      if (session?.user) {
        (session.user as any).id = token.uid;
      }
      return session;
    },
    jwt: async ({ user, token, account, profile }) => {
      if (user) {
        token.uid = user.id;
      }
      try {
        const { connection, collection } = await Accounts();
        await collection.findOneAndUpdate(
          { email: profile?.email },
          {
            $set: {
              name: (profile as any)?.username,
              image: (profile as any)?.image_url,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
      return token;
    },
  },
  providers:
    process.env.NODE_ENV === "production"
      ? [
          EmailProvider({
            server: {
              host: process.env.EMAIL_SERVER_HOST,
              port: Number(process.env.EMAIL_SERVER_PORT),
              auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
              },
            },
            from: process.env.EMAIL_FROM,
            allowDangerousEmailAccountLinking: true,
          } as any),
          DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID ?? "",
            clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
            allowDangerousEmailAccountLinking: true,
            async profile(profile) {
              if (!profile.avatar) {
                const defaultAvatarNumber = parseInt(profile.discriminator) % 5;
                profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
              } else {
                const format = profile.avatar.startsWith("a_") ? "gif" : "png";
                profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
              }

              return {
                id: profile.id,
                name: profile.username,
                email: profile.email,
                image: profile.image_url,
              };
            },
          }),
        ]
      : [
          EmailProvider({
            server: {
              host: process.env.EMAIL_SERVER_HOST,
              port: Number(process.env.EMAIL_SERVER_PORT),
              auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
              },
            },
            from: process.env.EMAIL_FROM,
            allowDangerousEmailAccountLinking: true,
          } as any),
          DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID ?? "",
            clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
            allowDangerousEmailAccountLinking: true,
            async profile(profile) {
              if (!profile.avatar) {
                const defaultAvatarNumber = parseInt(profile.discriminator) % 5;
                profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
              } else {
                const format = profile.avatar.startsWith("a_") ? "gif" : "png";
                profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
              }

              return {
                id: profile.id,
                name: profile.username,
                email: profile.email,
                image: profile.image_url,
              };
            },
          }),
        ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
});
