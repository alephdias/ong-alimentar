import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const publicPaths = ['/', '/login', '/register', '/confirm', '/api/auth']
  const isPublic = publicPaths.some(p => pathname === p || pathname.startsWith(p))
  if (isPublic) return NextResponse.next()

  const token = request.cookies.get('sb-access-token')?.value
    || request.cookies.get(`sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`)?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/distribuicoes/:path*', '/beneficiarios/:path*', '/estoque/:path*', '/pontos/:path*', '/relatorios/:path*'],
}
