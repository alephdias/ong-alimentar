import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { supabaseAdmin } from './supabase'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user }) {
      const db = supabaseAdmin()
      const { data } = await db
        .from('voluntarios')
        .select('id')
        .eq('email', user.email!)
        .single()
      return !!data
    },
    async session({ session, token }) {
      if (session.user) {
        const db = supabaseAdmin()
        const { data } = await db
          .from('voluntarios')
          .select('id, role')
          .eq('email', session.user.email!)
          .single()
        if (data) {
          ;(session.user as any).id = data.id
          ;(session.user as any).role = data.role
        }
      }
      return session
    },
  },
}

export default NextAuth(authOptions)