'use client'
import { useState, useEffect } from 'react'
import { Plus, Package, AlertTriangle } from 'lucide-react'
import type { EstoqueItem } from '@/types'

export default function EstoquePage() {
  const [itens, setItens] = useState<EstoqueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ item: '', quantidade: '', unidade: 'kg', validade: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    const res = await fetch('/api/estoque')
    const json = await res.json()
    setItens(json.data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/estoque', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, quantidade: Number(form.quantidade) }),
    })
    setForm({ item: '', quantidade: '', unidade: 'kg', validade: '' })
    setShowForm(false)
    setSaving(false)
    load()
  }

  async function updateQtd(id: string, newQtd: number) {
    await fetch('/api/estoque', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, quantidade: newQtd }),
    })
    load()
  }

  const criticos = itens.filter(i => i.quantidade < 20)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Estoque</h1>
          <p className="text-sm text-gray-500 mt-0.5">{itens.length} itens · {criticos.length} com estoque baixo</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Adicionar item
        </button>
      </div>

      {criticos.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Estoque baixo</p>
            <p className="text-sm text-amber-600">
              {criticos.map(i => i.item).join(', ')} — atenção necessária.
            </p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Adicionar ao estoque</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Item *</label>
                <input type="text" required className="input" placeholder="Ex: Arroz"
                  value={form.item} onChange={e => setForm(f => ({ ...f, item: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Quantidade *</label>
                  <input type="number" required min={0} step="0.1" className="input"
                    value={form.quantidade} onChange={e => setForm(f => ({ ...f, quantidade: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Unidade</label>
                  <select className="input" value={form.unidade}
                    onChange={e => setForm(f => ({ ...f, unidade: e.target.value }))}>
                    <option value="kg">kg</option>
                    <option value="litro">litro</option>
                    <option value="unidade">unidade</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Validade</label>
                <input type="date" className="input"
                  value={form.validade} onChange={e => setForm(f => ({ ...f, validade: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Carregando...</div>
      ) : itens.length === 0 ? (
        <div className="card text-center py-12">
          <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum item no estoque.</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-medium px-5 py-3">Item</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Quantidade</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Validade</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item, i) => {
                const status = item.quantidade < 10 ? 'urgente' : item.quantidade < 20 ? 'baixo' : 'ok'
                const statusClass = status === 'urgente' ? 'badge-urgent' : status === 'baixo' ? 'badge-low' : 'badge-ok'
                return (
                  <tr key={item.id} className={`border-b border-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                    <td className="px-5 py-3 font-medium text-gray-900">{item.item}</td>
                    <td className="px-4 py-3 text-gray-600">{item.quantidade} {item.unidade}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {item.validade ? new Date(item.validade).toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusClass}`}>{status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQtd(item.id, Math.max(0, item.quantidade - 1))}
                          className="w-6 h-6 rounded border border-gray-200 text-gray-400 hover:bg-gray-100 flex items-center justify-center text-xs"
                        >−</button>
                        <button
                          onClick={() => updateQtd(item.id, item.quantidade + 1)}
                          className="w-6 h-6 rounded border border-gray-200 text-gray-400 hover:bg-gray-100 flex items-center justify-center text-xs"
                        >+</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
