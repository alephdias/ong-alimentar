'use client'
import { useState, useEffect } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { TrendingUp, Utensils, Users, MapPin, Download } from 'lucide-react'

const dadosMensais = [
  { mes: 'Jan', refeicoes: 2840, beneficiarios: 480 },
  { mes: 'Fev', refeicoes: 3100, beneficiarios: 510 },
  { mes: 'Mar', refeicoes: 2950, beneficiarios: 495 },
  { mes: 'Abr', refeicoes: 3380, beneficiarios: 560 },
  { mes: 'Mai', refeicoes: 3200, beneficiarios: 530 },
  { mes: 'Jun', refeicoes: 3520, beneficiarios: 580 },
  { mes: 'Jul', refeicoes: 3750, beneficiarios: 620 },
  { mes: 'Ago', refeicoes: 3600, beneficiarios: 600 },
  { mes: 'Set', refeicoes: 3900, beneficiarios: 640 },
  { mes: 'Out', refeicoes: 4100, beneficiarios: 670 },
  { mes: 'Nov', refeicoes: 3980, beneficiarios: 655 },
  { mes: 'Dez', refeicoes: 3842, beneficiarios: 641 },
]

const dadosPorPonto = [
  { ponto: 'Brás', refeicoes: 210 },
  { ponto: 'Al. Dino Bueno', refeicoes: 183 },
  { ponto: 'Praça da Sé', refeicoes: 127 },
  { ponto: 'Glicério', refeicoes: 120 },
  { ponto: 'Luz', refeicoes: 98 },
  { ponto: 'Pq. Dom Pedro', refeicoes: 95 },
  { ponto: 'Liberdade', refeicoes: 70 },
]

const dadosSituacao = [
  { name: 'Morador de rua', value: 68, color: '#1D9E75' },
  { name: 'Vulnerabilidade', value: 32, color: '#9FE1CB' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-3">
        <p className="text-xs font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="text-xs text-gray-500">
            {p.name}: <span className="font-medium text-gray-900">{p.value.toLocaleString('pt-BR')}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function RelatoriosPage() {
  const [periodo, setPeriodo] = useState<'3m' | '6m' | '12m'>('12m')

  const dadosFiltrados = periodo === '3m'
    ? dadosMensais.slice(-3)
    : periodo === '6m'
    ? dadosMensais.slice(-6)
    : dadosMensais

  const totalRefeicoes = dadosFiltrados.reduce((s, d) => s + d.refeicoes, 0)
  const mediaRefeicoes = Math.round(totalRefeicoes / dadosFiltrados.length)
  const maxBeneficiarios = Math.max(...dadosFiltrados.map(d => d.beneficiarios))
  const crescimento = Math.round(
    ((dadosFiltrados[dadosFiltrados.length - 1].refeicoes - dadosFiltrados[0].refeicoes)
    / dadosFiltrados[0].refeicoes) * 100
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Relatórios</h1>
          <p className="text-sm text-gray-500 mt-0.5">Análise de impacto e desempenho da ONG</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {(['3m', '6m', '12m'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  periodo === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                {p === '3m' ? '3 meses' : p === '6m' ? '6 meses' : '12 meses'}
              </button>
            ))}
          </div>
          <button className="btn-secondary text-xs">
            <Download className="w-3.5 h-3.5" /> Exportar
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total de refeições', value: totalRefeicoes.toLocaleString('pt-BR'), icon: Utensils, color: 'text-brand-600', bg: 'bg-brand-50' },
          { label: 'Média mensal', value: mediaRefeicoes.toLocaleString('pt-BR'), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pico de beneficiários', value: maxBeneficiarios.toLocaleString('pt-BR'), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Crescimento', value: `${crescimento > 0 ? '+' : ''}${crescimento}%`, icon: MapPin, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card">
            <div className={`inline-flex p-2 rounded-lg mb-3 ${bg}`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Gráfico de refeições por mês */}
      <div className="card mb-5">
        <h2 className="font-medium text-gray-900 mb-4">Refeições distribuídas por mês</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={dadosFiltrados} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="refeicoes" name="Refeições" fill="#1D9E75" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Evolução de beneficiários */}
        <div className="card">
          <h2 className="font-medium text-gray-900 mb-4">Evolução de beneficiários</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={dadosFiltrados}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone" dataKey="beneficiarios" name="Beneficiários"
                stroke="#1D9E75" strokeWidth={2} dot={{ fill: '#1D9E75', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Situação dos beneficiários */}
        <div className="card">
          <h2 className="font-medium text-gray-900 mb-4">Perfil dos beneficiários</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie
                  data={dadosSituacao} cx="50%" cy="50%"
                  innerRadius={40} outerRadius={65}
                  dataKey="value" strokeWidth={0}
                >
                  {dadosSituacao.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {dadosSituacao.map(item => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                      <span className="text-xs text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-900">{item.value}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Refeições por ponto */}
      <div className="card">
        <h2 className="font-medium text-gray-900 mb-4">Refeições por ponto de distribuição (média/dia)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dadosPorPonto} layout="vertical" barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="ponto" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={110} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="refeicoes" name="Refeições/dia" fill="#1D9E75" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
