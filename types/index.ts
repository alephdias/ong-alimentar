export type UserRole = 'admin' | 'voluntario'

export interface Voluntario {
  id: string
  email: string
  nome: string | null
  role: UserRole
  created_at: string
}

export interface Beneficiario {
  id: string
  nome: string | null
  apelido: string | null
  situacao: 'morador_rua' | 'vulneravel' | null
  ponto_frequente: string | null
  created_at: string
}

export interface Distribuicao {
  id: string
  data: string
  local: string
  refeicoes_servidas: number
  voluntario_id: string | null
  observacoes: string | null
  created_at: string
  voluntario?: { nome: string | null; email: string }
}

export interface EstoqueItem {
  id: string
  item: string
  quantidade: number
  unidade: 'kg' | 'unidade' | 'litro' | null
  validade: string | null
  updated_at: string
}

export interface DashboardStats {
  refeicoesMes: number
  beneficiariosAtivos: number
  pontosAtivos: number
  itensEstoque: number
  itensEstoqueBaixo: number
}
