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