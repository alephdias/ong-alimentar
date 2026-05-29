'use client'
import { useState, useEffect } from 'react'
import { Plus, Users, MapPin } from 'lucide-react'
import type { Beneficiario } from '@/types'

const situacaoLabel = { morador_rua: 'Morador de rua', vulneravel: 'Situação de vulnerabilidade' }
const situacaoColor = { morador_rua: 'badge-urgent', vulneravel: 'badge-low' }

export default function BeneficiariosPage() {
  const [lista, setLista] = useState<Beneficiario[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nome: '', apelido: '', situacao: '', ponto_frequente: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    const res = await fetch('/api/beneficiarios')
    const json = await res.json()
    setLista(json.data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/beneficiarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setForm({ nome: '', apelido: '', situacao: '', ponto_frequente: '' })
    setShowForm(false)
    setSaving(false)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Beneficiários</h1>
          <p className="text-sm text-gray-500 mt-0.5">{lista.length} pessoas cadastradas</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Cadastrar
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Cadastrar beneficiário</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Nome</label>
                <input type="text" className="input" placeholder="Nome completo (opcional)"
                  value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Apelido / Como é conhecido</label>
                <input type="text" className="input" placeholder="Ex: João do Viaduto"
                  value={form.apelido} onChange={e => setForm(f => ({ ...f, apelido: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Situação</label>
                <select className="input" value={form.situacao}
                  onChange={e => setForm(f => ({ ...f, situacao: e.target.value }))}>
                  <option value="">Selecione...</option>
                  <option value="morador_rua">Morador de rua</option>
                  <option value="vulneravel">Situação de vulnerabilidade</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Ponto frequente</label>
                <input type="text" className="input" placeholder="Ex: Praça da Sé"
                  value={form.ponto_frequente} onChange={e => setForm(f => ({ ...f, ponto_frequente: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? 'Salvando...' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Carregando...</div>
      ) : lista.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum beneficiário cadastrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lista.map((b) => (
            <div key={b.id} className="card">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-sm font-medium text-brand-700 flex-shrink-0">
                  {(b.apelido ?? b.nome ?? '?').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{b.apelido ?? b.nome ?? 'Sem nome'}</p>
                  {b.nome && b.apelido && <p className="text-xs text-gray-400">{b.nome}</p>}
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {b.situacao && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${situacaoColor[b.situacao]}`}>
                        {situacaoLabel[b.situacao]}
                      </span>
                    )}
                    {b.ponto_frequente && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="w-3 h-3" /> {b.ponto_frequente}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
