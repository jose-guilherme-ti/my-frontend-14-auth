import CredentialsProvider from "next-auth/providers/credentials";

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // chamada para sua API GraphQL
        const res = await fetch("http://localhost:4000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              mutation Login($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                  token
                  user {
                    id
                    email
                    name
                    role
                  }
                }
              }
            `,
            variables: {
              email: credentials.email,
              password: credentials.password,
            },
          }),
        });

        const json = await res.json();
        const data = json?.data?.login;

        if (!data) return null;

        return {
          ...data.user,
          accessToken: data.token,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        role: token.role,
      };
      session.accessToken = token.accessToken;
      return session;
    },
  },

  pages: {
    signIn: "/login", // sua página de login
    signOut: "/login",
  },

  session: {
    strategy: "jwt",
  },
};
