import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email?: string | null
      image?: string | null
      invoiceCount: number
      subscription: 'free' | 'paid'
    }
  }
}


