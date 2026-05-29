export const dynamic = 'force-dynamic'

import { supabaseAdmin } from '@/lib/supabase'
import { Utensils, Users, MapPin, Package, AlertTriangle } from 'lucide-react'
import type { Distribuicao, EstoqueItem } from '@/types'

async function getDashboardData() {
  const db = supabaseAdmin()
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]

  const [distribuicoesMes, beneficiarios, estoque, ultimasDistribuicoes] = await Promise.all([
    db.from('distribuicoes').select('refeicoes_servidas').gte('data', startOfMonth),
    db.from('beneficiarios').select('id', { count: 'exact', head: true }),
    db.from('estoque').select('*').order('quantidade', { ascending: true }),
    db.from('distribuicoes')
      .select('*, voluntario:voluntarios(nome, email)')
      .order('data', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const refeicoesMes = (distribuicoesMes.data ?? []).reduce(
    (sum, d) => sum + (d.refeicoes_servidas ?? 0), 0
  )
  const itensEstoqueBaixo = (estoque.data ?? []).filter(
    (i: EstoqueItem) => i.quantidade < 20
  ).length

  return {
    refeicoesMes,
    beneficiariosTotal: beneficiarios.count ?? 0,
    itensEstoque: estoque.data?.length ?? 0,
    itensEstoqueBaixo,
    estoque: (estoque.data ?? []) as EstoqueItem[],
    ultimasDistribuicoes: (ultimasDistribuicoes.data ?? []) as Distribuicao[],
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  const stats = [
    { label: 'Refeições este mês', value: data.refeicoesMes.toLocaleString('pt-BR'), icon: Utensils, color: 'brand' },
    { label: 'Beneficiários', value: data.beneficiariosTotal.toLocaleString('pt-BR'), icon: Users, color: 'blue' },
    { label: 'Itens em estoque', value: data.itensEstoque, icon: Package, color: 'amber' },
    { label: 'Estoque crítico', value: data.itensEstoqueBaixo, icon: AlertTriangle, color: 'red' },
  ]

  const colorMap: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className={`inline-flex p-2 rounded-lg mb-3 ${colorMap[color]}`}>
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-gray-900">Últimas distribuições</h2>
            <a href="/distribuicoes" className="text-xs text-brand-600 hover:underline">Ver todas →</a>
          </div>
          {data.ultimasDistribuicoes.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Nenhuma distribuição registrada ainda.</p>
          ) : (
            <div className="space-y-3">
              {data.ultimasDistribuicoes.map((d) => (
                <div key={d.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Utensils className="w-4 h-4 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{d.local}</p>
                    <p className="text-xs text-gray-400">{new Date(d.data).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <span className="text-sm font-medium text-brand-600 flex-shrink-0">
                    {d.refeicoes_servidas} refeições
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-gray-900">Status do estoque</h2>
            <a href="/estoque" className="text-xs text-brand-600 hover:underline">Gerenciar →</a>
          </div>
          {data.estoque.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Nenhum item cadastrado.</p>
          ) : (
            <div className="space-y-3">
              {data.estoque.slice(0, 6).map((item) => {
                const pct = Math.min(100, Math.round((item.quantidade / 100) * 100))
                const status = item.quantidade < 10 ? 'urgent' : item.quantidade < 20 ? 'low' : 'ok'
                const barColor = status === 'urgent' ? 'bg-red-400' : status === 'low' ? 'bg-amber-400' : 'bg-brand-500'
                const badgeClass = status === 'urgent' ? 'badge-urgent' : status === 'low' ? 'badge-low' : 'badge-ok'
                const badgeLabel = status === 'urgent' ? 'urgente' : status === 'low' ? 'baixo' : 'ok'
                return (
                  <div key={item.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{item.item}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{item.quantidade} {item.unidade ?? ''}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${badgeClass}`}>{badgeLabel}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${barColor} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}