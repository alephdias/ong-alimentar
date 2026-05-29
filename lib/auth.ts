import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { SupabaseAdapter } from '@auth/supabase-adapter'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user }) {
      // Só permite login se o email estiver cadastrado como voluntário
      const { supabaseAdmin } = await import('./supabase')
      const db = supabaseAdmin()
      const { data } = await db
        .from('voluntarios')
        .select('id')
        .eq('email', user.email!)
        .single()
      return !!data
    },
    async session({ session, user }) {
      // Adiciona role e id do voluntário à sessão
      if (session.user) {
        const { supabaseAdmin } = await import('./supabase')
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
  session: { strategy: 'database' },
}

export default NextAuth(authOptions)
