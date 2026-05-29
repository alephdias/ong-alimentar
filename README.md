# 🤝 Alimentar SP — Sistema de Gestão da ONG

Sistema web para gestão de distribuição de alimentos para pessoas em situação de rua e vulnerabilidade social no centro de São Paulo.

## ✨ Funcionalidades

- **Dashboard** com estatísticas em tempo real (refeições servidas, beneficiários, estoque)
- **Distribuições** — registro de cada ação de distribuição de alimentos
- **Beneficiários** — cadastro das pessoas atendidas
- **Estoque** — controle de alimentos com alertas de estoque baixo
- **Autenticação segura** via Google (acesso restrito a voluntários cadastrados)

## 🛠️ Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14 + Tailwind CSS |
| Backend | Next.js API Routes |
| Banco de dados | Supabase (PostgreSQL) — gratuito |
| Autenticação | NextAuth.js + Google OAuth |
| Deploy | Vercel — gratuito |

---

## 🚀 Configuração — Passo a Passo

### 1. Clonar e instalar

```bash
git clone https://github.com/SEU_USUARIO/ong-alimentar
cd ong-alimentar
npm install
```

### 2. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) → **New project**
2. Após criar, vá em **SQL Editor** e cole o conteúdo de `sql/migration.sql`
3. **Edite a última linha** com seu email do Google antes de executar
4. Copie as chaves em **Settings → API**

### 3. Configurar Google OAuth

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um projeto → **APIs & Services → Credentials**
3. **Create Credentials → OAuth 2.0 Client ID** → Web Application
4. Em **Authorized redirect URIs**, adicione:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://SEU-PROJETO.vercel.app/api/auth/callback/google`
5. Copie o Client ID e Client Secret

### 4. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com as chaves coletadas acima.

Para gerar o `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 5. Rodar localmente

```bash
npm run dev
# Acesse http://localhost:3000
```

---

## 🌐 Deploy na Vercel

```bash
# Subir para o GitHub
git init
git add .
git commit -m "feat: sistema de gestão da ONG Alimentar SP"
gh repo create ong-alimentar --public --push
```

1. Acesse [vercel.com](https://vercel.com) → **Add New Project**
2. Importe o repositório do GitHub
3. Em **Environment Variables**, adicione todas as variáveis do `.env.local`
4. Clique em **Deploy** ✅

---

## 👥 Gerenciar voluntários

Para autorizar um novo voluntário, execute no Supabase SQL Editor:

```sql
INSERT INTO voluntarios (email, nome, role)
VALUES ('novo@email.com', 'Nome do Voluntário', 'voluntario');
```

---

## 📁 Estrutura do projeto

```
ong-alimentar/
├── app/
│   ├── (auth)/login/         ← Página de login
│   ├── (dashboard)/          ← Área autenticada
│   │   ├── dashboard/        ← Dashboard principal
│   │   ├── distribuicoes/    ← Gestão de distribuições
│   │   ├── beneficiarios/    ← Cadastro de beneficiários
│   │   └── estoque/          ← Controle de estoque
│   ├── api/                  ← API Routes (back-end)
│   │   ├── auth/             ← NextAuth
│   │   ├── distribuicoes/
│   │   ├── beneficiarios/
│   │   └── estoque/
│   └── layout.tsx
├── components/
│   └── dashboard/Sidebar.tsx
├── lib/
│   ├── auth.ts               ← Configuração NextAuth
│   └── supabase.ts           ← Clientes Supabase
├── sql/
│   └── migration.sql         ← Criar tabelas no Supabase
├── types/index.ts
└── .env.example
```

---

## 🎓 Trabalho acadêmico

Sistema desenvolvido como projeto de fins sociais para disciplina de desenvolvimento web.

**ONG beneficiada:** Distribuição de alimentos — Centro de São Paulo  
**Impacto:** Facilitar a organização de voluntários e o controle de recursos alimentares
