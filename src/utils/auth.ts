import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/utils/initPrisma';
import { compare } from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  // pages: {
  //   signIn: '/login',
  // },
  // adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    // strategy: 'database',
  },
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'Login',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !(await compare(credentials.password, user.password))) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          randomKey: 'Hey cool',
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      // console.log('JWT Callback', { token, user });
      if (user) {
        const u = user as any;
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey,
        };
      }
      return token;
    },
    session: ({ session, token }) => {
      // console.log('Session Callback', { session, token });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          randomKey: token.randomKey,
        },
      };
    },
  },
};

// async authorize(credentials) {
//   const user = { id: '1', name: 'Admin', email: 'admin@admin.com' };
//   return user;

//   adapter: PrismaAdapter(prisma),

// const response = await fetch('http://localhost:3000/api/auth/login', {
//   method: 'GET',
//   body: JSON.stringify(credentials),
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// if (!response) {
//   console.log('NOOOOOOOOOOOOOOOOOOOO');
// }

// const user = await response.json();
// console.log(user);
