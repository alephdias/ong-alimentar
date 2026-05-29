import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  const db = supabaseAdmin()
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = 20
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await db
    .from('distribuicoes')
    .select('*, voluntario:voluntarios(nome, email)', { count: 'exact' })
    .order('data', { ascending: false })
    .range(from, to)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, total: count })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { data, local, refeicoes_servidas, observacoes } = body

  if (!data || !local || !refeicoes_servidas) {
    return NextResponse.json({ error: 'Campos obrigatórios: data, local, refeicoes_servidas' }, { status: 400 })
  }

  const db = supabaseAdmin()
  const { data: result, error } = await db
    .from('distribuicoes')
    .insert({ data, local, refeicoes_servidas: Number(refeicoes_servidas), observacoes })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: result }, { status: 201 })
}