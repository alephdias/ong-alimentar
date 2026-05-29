-- ================================================
-- Alimentar SP — Migração inicial do banco de dados
-- Cole este SQL no Supabase SQL Editor e execute
-- ================================================

-- 1. Voluntários autorizados (apenas emails aqui podem fazer login)
CREATE TABLE IF NOT EXISTS voluntarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  nome TEXT,
  role TEXT NOT NULL DEFAULT 'voluntario' CHECK (role IN ('admin', 'voluntario')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Beneficiários atendidos pela ONG
CREATE TABLE IF NOT EXISTS beneficiarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT,
  apelido TEXT,
  situacao TEXT CHECK (situacao IN ('morador_rua', 'vulneravel')),
  ponto_frequente TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Registros de distribuição de alimentos
CREATE TABLE IF NOT EXISTS distribuicoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  local TEXT NOT NULL,
  refeicoes_servidas INTEGER NOT NULL CHECK (refeicoes_servidas > 0),
  voluntario_id UUID REFERENCES voluntarios(id) ON DELETE SET NULL,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Controle de estoque
CREATE TABLE IF NOT EXISTS estoque (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item TEXT NOT NULL,
  quantidade NUMERIC NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
  unidade TEXT CHECK (unidade IN ('kg', 'litro', 'unidade')),
  validade DATE,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ================================================
-- NextAuth adapter tables (necessário para @auth/supabase-adapter)
-- ================================================

CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE (provider, "providerAccountId")
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId" UUID NOT NULL,
  expires TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image TEXT
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- ================================================
-- Dados iniciais: inserir primeiro admin da ONG
-- (substitua pelo seu email do Google)
-- ================================================

INSERT INTO voluntarios (email, nome, role)
VALUES ('SEU_EMAIL@gmail.com', 'Admin da ONG', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Dados de exemplo para desenvolvimento
INSERT INTO distribuicoes (data, local, refeicoes_servidas, observacoes) VALUES
  (CURRENT_DATE, 'Praça da Sé', 127, 'Distribuição do almoço'),
  (CURRENT_DATE - 1, 'Luz - Rua dos Andradas', 98, null),
  (CURRENT_DATE - 2, 'Brás - Av. Rangel Pestana', 210, 'Evento especial com parceiros'),
  (CURRENT_DATE - 3, 'Cracolândia - Alameda Dino Bueno', 183, null);

INSERT INTO estoque (item, quantidade, unidade, validade) VALUES
  ('Arroz', 82, 'kg', CURRENT_DATE + 180),
  ('Feijão', 38, 'kg', CURRENT_DATE + 180),
  ('Macarrão', 51, 'kg', CURRENT_DATE + 365),
  ('Óleo de soja', 14, 'litro', CURRENT_DATE + 90),
  ('Proteína de soja', 6, 'kg', CURRENT_DATE + 60),
  ('Sal', 25, 'kg', CURRENT_DATE + 730),
  ('Açúcar', 30, 'kg', CURRENT_DATE + 365);
