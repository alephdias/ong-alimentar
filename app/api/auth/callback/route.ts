import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  console.log('=== CALLBACK ===')
  console.log('URL completa:', request.url)
  console.log('code:', code)
  console.log('error:', error)
  console.log('todos params:', Object.fromEntries(searchParams))

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${error}`)
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}