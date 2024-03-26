import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { findUserByEmail, getUserByEmailOrCreate } from './actions/auth';

async function getUser(email: string): Promise<User | null> {
    try {
        return await findUserByEmail(email);
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    callbacks: {
       signIn: async ({ account, profile }) => {
        if (account?.provider === 'google' && profile?.email_verified) {
            const googleUser = await getUserByEmailOrCreate({ name: profile.name ?? '', email: profile.email ?? '' });
            if (!googleUser) {
                throw new Error('Failed to create or fetch user.');
            }
            return true;
        }
        return false;
        },
       
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            authorization: {
              params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code"
              }
            }
          }),
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});