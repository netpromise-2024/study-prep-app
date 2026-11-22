import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ profile }) {
      const allowedId = process.env.PARENT_GITHUB_ID;
      return Boolean(allowedId && profile?.id && String(profile.id) === allowedId);
    },
  },
});
