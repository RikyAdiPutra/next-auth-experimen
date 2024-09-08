import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // console.log("Credentials:", credentials); // Tambahkan di sini untuk melihat input user

        const { username, password } = credentials;

        const res = await fetch(`https://popi.stagingaja.com/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const user = await res.json();
        // console.log("User response:", user); // Tambahkan di sini untuk melihat respons API

        if (res?.ok && user) {
          // console.log("Login successful, user:", user); // Login berhasil
          return user; // Mengembalikan objek user untuk digunakan di sesi
        } else {
          // console.log("Login failed"); // Login gagal
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login", // Custom login page
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // async jwt({ token, user }) {
    //   if (user) {
    //     token.id = user.id;
    //     token.email = user.email;
    //     token.name = user.name;
    //   }
    //   return token;
    // },
    // async session({ session, token }) {
    //   session.user.id = token.id;
    //   session.user.email = token.email;
    //   // Menampilkan session dan token di konsol
    //   console.log("Session Callback - Session:", session);
    //   console.log("Session Callback - Token:", token);
    //   return session;
    // },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
