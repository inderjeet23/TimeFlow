import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { users } from '@/lib/user-store'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null

        let user = users.find((u) => u.email === credentials.email)
        if (!user) {
          user = {
            id: Date.now().toString(),
            email: credentials.email,
            invoiceCount: 0,
            subscription: 'free',
          }
          users.push(user)
        }
        return user
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      const user = users.find((u) => u.id === token.sub)
      if (user && session.user) {
        session.user.id = user.id
        session.user.invoiceCount = user.invoiceCount
        session.user.subscription = user.subscription
      }
      return session
    },
  },
}


