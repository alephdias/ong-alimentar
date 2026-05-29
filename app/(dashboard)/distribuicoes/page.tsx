'use client'
import { useState, useEffect } from 'react'
import { Plus, Utensils, MapPin, Calendar, User } from 'lucide-react'
import type { Distribuicao } from '@/types'

export default function DistribuicoesPage() {
  const [distribuicoes, setDistribuicoes] = useState<Distribuicao[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ data: '', local: '', refeicoes_servidas: '', observacoes: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    const res = await fetch('/api/distribuicoes')
    const json = await res.json()
    setDistribuicoes(json.data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/distribuicoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setForm({ data: '', local: '', refeicoes_servidas: '', observacoes: '' })
    setShowForm(false)
    setSaving(false)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Distribuições</h1>
          <p className="text-sm text-gray-500 mt-0.5">Registros de distribuição de alimentos</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Nova distribuição
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Registrar distribuição</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Data *</label>
                <input type="date" required className="input"
                  value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Local *</label>
                <input type="text" required placeholder="Ex: Praça da Sé" className="input"
                  value={form.local} onChange={e => setForm(f => ({ ...f, local: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Refeições servidas *</label>
                <input type="number" required min={1} placeholder="0" className="input"
                  value={form.refeicoes_servidas} onChange={e => setForm(f => ({ ...f, refeicoes_servidas: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Observações</label>
                <textarea rows={3} placeholder="Opcional..." className="input resize-none"
                  value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Carregando...</div>
      ) : distribuicoes.length === 0 ? (
        <div className="card text-center py-12">
          <Utensils className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">Nenhuma distribuição registrada ainda.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-4 mx-auto">
            <Plus className="w-4 h-4" /> Registrar primeira
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {distribuicoes.map((d) => (
            <div key={d.id} className="card flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Utensils className="w-5 h-5 text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-sm font-medium text-gray-900 truncate">{d.local}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(d.data).toLocaleDateString('pt-BR')}
                  </span>
                  {d.voluntario && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {(d.voluntario as any).nome ?? (d.voluntario as any).email}
                    </span>
                  )}
                </div>
                {d.observacoes && <p className="text-xs text-gray-400 mt-1">{d.observacoes}</p>}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-semibold text-brand-600">{d.refeicoes_servidas}</p>
                <p className="text-xs text-gray-400">refeições</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
