'use client'
import { MapPin, Clock, Utensils, Phone, Plus, X } from 'lucide-react'
import { useState } from 'react'

const PONTOS_INICIAIS = [
  {
    id: 1,
    local: 'Praça da Sé',
    endereco: 'Praça da Sé, s/n — Sé, São Paulo',
    freq: 'Diário',
    horario: '11h30 – 13h00',
    refeicoes: 127,
    responsavel: 'Carlos Mendes',
    contato: '(11) 99999-0001',
    status: 'ativo',
  },
  {
    id: 2,
    local: 'Luz — Rua dos Andradas',
    endereco: 'R. dos Andradas, 550 — Luz, São Paulo',
    freq: 'Seg, Qua, Sex',
    horario: '18h00 – 19h30',
    refeicoes: 98,
    responsavel: 'Letícia Ferraz',
    contato: '(11) 99999-0002',
    status: 'ativo',
  },
  {
    id: 3,
    local: 'Brás — Av. Rangel Pestana',
    endereco: 'Av. Rangel Pestana, 1200 — Brás, São Paulo',
    freq: 'Diário',
    horario: '12h00 – 13h30',
    refeicoes: 210,
    responsavel: 'Marcos Souza',
    contato: '(11) 99999-0003',
    status: 'ativo',
  },
  {
    id: 4,
    local: 'Alameda Dino Bueno',
    endereco: 'Al. Dino Bueno, 150 — Campos Elíseos, São Paulo',
    freq: 'Diário',
    horario: '19h00 – 20h30',
    refeicoes: 183,
    responsavel: 'Ana Paula',
    contato: '(11) 99999-0004',
    status: 'ativo',
  },
  {
    id: 5,
    local: 'Parque Dom Pedro II',
    endereco: 'Pq. Dom Pedro II, s/n — Brás, São Paulo',
    freq: 'Ter, Qui, Sáb',
    horario: '12h30 – 14h00',
    refeicoes: 95,
    responsavel: 'Roberto Lima',
    contato: '(11) 99999-0005',
    status: 'ativo',
  },
  {
    id: 6,
    local: 'Liberdade — Praça da Liberdade',
    endereco: 'Pça. da Liberdade, s/n — Liberdade, São Paulo',
    freq: 'Qua, Sáb',
    horario: '11h00 – 12h30',
    refeicoes: 70,
    responsavel: 'Yuki Tanaka',
    contato: '(11) 99999-0006',
    status: 'ativo',
  },
  {
    id: 7,
    local: 'Glicério — Rua do Glicério',
    endereco: 'R. do Glicério, 80 — Glicério, São Paulo',
    freq: 'Seg a Sex',
    horario: '13h00 – 14h30',
    refeicoes: 120,
    responsavel: 'Fernanda Costa',
    contato: '(11) 99999-0007',
    status: 'ativo',
  },
]

const statusColor: Record<string, string> = {
  ativo: 'badge-ok',
  inativo: 'badge-urgent',
  temporario: 'badge-low',
}

const statusLabel: Record<string, string> = {
  ativo: 'ativo',
  inativo: 'inativo',
  temporario: 'temporário',
}

export default function PontosPage() {
  const [pontos, setPontos] = useState(PONTOS_INICIAIS)
  const [selected, setSelected] = useState<typeof PONTOS_INICIAIS[0] | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    local: '', endereco: '', freq: '', horario: '',
    responsavel: '', contato: '', refeicoes: '',
  })

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setPontos(prev => [...prev, {
      id: Date.now(),
      ...form,
      refeicoes: Number(form.refeicoes),
      status: 'ativo',
    }])
    setForm({ local: '', endereco: '', freq: '', horario: '', responsavel: '', contato: '', refeicoes: '' })
    setShowForm(false)
  }

  const totalRefeicoes = pontos.reduce((s, p) => s + p.refeicoes, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Pontos de distribuição</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {pontos.length} pontos ativos · {totalRefeicoes} refeições/dia
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Novo ponto
        </button>
      </div>

      {/* Mapa placeholder */}
      <div className="card mb-6 p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-brand-50 to-blue-50 h-48 flex items-center justify-center relative">
          <div className="text-center">
            <MapPin className="w-10 h-10 text-brand-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Centro de São Paulo</p>
            <p className="text-xs text-gray-400 mt-1">{pontos.length} pontos de distribuição ativos</p>
          </div>
          {/* Pins decorativos */}
          {[
            { top: '30%', left: '45%' }, { top: '55%', left: '30%' },
            { top: '40%', left: '60%' }, { top: '65%', left: '50%' },
            { top: '25%', left: '70%' }, { top: '70%', left: '35%' },
            { top: '50%', left: '55%' },
          ].map((pos, i) => (
            <div key={i} style={{ position: 'absolute', top: pos.top, left: pos.left }}>
              <div className="w-4 h-4 bg-brand-500 rounded-full border-2 border-white shadow-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Novo ponto de distribuição</h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Nome do local *</label>
                <input required className="input" placeholder="Ex: Praça Roosevelt"
                  value={form.local} onChange={e => setForm(f => ({ ...f, local: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Endereço *</label>
                <input required className="input" placeholder="Rua, número — Bairro"
                  value={form.endereco} onChange={e => setForm(f => ({ ...f, endereco: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Frequência *</label>
                  <input required className="input" placeholder="Ex: Diário"
                    value={form.freq} onChange={e => setForm(f => ({ ...f, freq: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Horário *</label>
                  <input required className="input" placeholder="Ex: 12h–13h30"
                    value={form.horario} onChange={e => setForm(f => ({ ...f, horario: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Média de refeições/dia</label>
                <input type="number" min={0} className="input" placeholder="0"
                  value={form.refeicoes} onChange={e => setForm(f => ({ ...f, refeicoes: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Responsável</label>
                <input className="input" placeholder="Nome do voluntário responsável"
                  value={form.responsavel} onChange={e => setForm(f => ({ ...f, responsavel: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Contato</label>
                <input className="input" placeholder="(11) 99999-0000"
                  value={form.contato} onChange={e => setForm(f => ({ ...f, contato: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                <button type="submit" className="btn-primary flex-1 justify-center">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detalhe do ponto selecionado */}
      {selected && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-semibold text-gray-900">{selected.local}</h2>
                <p className="text-sm text-gray-400 mt-0.5">{selected.endereco}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-brand-500" />
                <span className="text-gray-600">{selected.freq} · {selected.horario}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Utensils className="w-4 h-4 text-brand-500" />
                <span className="text-gray-600">{selected.refeicoes} refeições/dia em média</span>
              </div>
              {selected.responsavel && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-brand-500" />
                  <span className="text-gray-600">Responsável: {selected.responsavel}</span>
                </div>
              )}
              {selected.contato && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-brand-500" />
                  <span className="text-gray-600">{selected.contato}</span>
                </div>
              )}
            </div>
            <button onClick={() => setSelected(null)} className="btn-secondary w-full justify-center mt-5">
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Grid de pontos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pontos.map((ponto) => (
          <div
            key={ponto.id}
            className="card cursor-pointer hover:border-brand-200 hover:shadow-md transition-all"
            onClick={() => setSelected(ponto)}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{ponto.local}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${statusColor[ponto.status]}`}>
                    {statusLabel[ponto.status]}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{ponto.endereco}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" /> {ponto.freq} · {ponto.horario}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-400">Responsável: {ponto.responsavel || '—'}</span>
              <span className="text-sm font-medium text-brand-600">{ponto.refeicoes} ref/dia</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
