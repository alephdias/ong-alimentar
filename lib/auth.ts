import { createClient } from '@supabase/supabase-js'

export function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function ensureVoluntario(email: string, nome: string | null) {
  const db = getSupabaseAdmin()
  const { data } = await db
    .from('voluntarios')
    .select('id')
    .eq('email', email)
    .single()

  if (!data) {
    await db.from('voluntarios').insert({
      email,
      nome: nome ?? email.split('@')[0],
      role: 'voluntario',
    })
  }
}
