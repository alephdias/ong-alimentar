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
      try {
        const db = supabaseAdmin()
        const { data, error } = await db
          .from('voluntarios')
          .select('id')
          .eq('email', user.email!)
          .single()
        console.log('signIn email:', user.email)
        console.log('signIn data:', data)
        console.log('signIn error:', error)
        return !!data
      } catch (e) {
        console.log('signIn exception:', e)
        return false
      }
    },
    async session({ session }) {
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