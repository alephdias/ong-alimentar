'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight, Github } from 'lucide-react'
import Link from 'next/link'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

type Mode = 'login' | 'register'

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function getRedirectTo() {
    return `${window.location.origin}/api/auth/callback`
  }

  async function handleOAuth(provider: 'google' | 'github' | 'azure') {
    setOauthLoading(provider)
    setError('')
    const supabase = getSupabase()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: getRedirectTo() },
    })
    if (error) { setError(error.message); setOauthLoading(null) }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    const supabase = getSupabase()

    if (mode === 'register') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: nome },
          emailRedirectTo: getRedirectTo(),
        },
      })
      if (error) setError(error.message)
      else setSuccess('Conta criada! Verifique seu email para confirmar o acesso.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('Email ou senha incorretos.')
      else window.location.href = '/dashboard'
    }
    setLoading(false)
  }

  const providers = [
    {
      id: 'google' as const,
      label: 'Google',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
    },
    {
      id: 'github' as const,
      label: 'GitHub',
      icon: <Github className="w-5 h-5" />,
    },
    {
      id: 'azure' as const,
      label: 'Microsoft',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#f25022" d="M1 1h10v10H1z"/>
          <path fill="#00a4ef" d="M13 1h10v10H13z"/>
          <path fill="#7fba00" d="M1 13h10v10H1z"/>
          <path fill="#ffb900" d="M13 13h10v10H13z"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-950 flex-col justify-between p-12 relative overflow-hidden">
        <div style={{ position:'absolute',top:-80,right:-80,width:320,height:320,borderRadius:'50%',background:'rgba(29,158,117,0.12)',filter:'blur(40px)' }} />
        <div style={{ position:'absolute',bottom:-60,left:-60,width:240,height:240,borderRadius:'50%',background:'rgba(29,158,117,0.08)',filter:'blur(30px)' }} />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'#1D9E75' }}>
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-white font-medium">Alimentar SP</span>
        </div>

        <div className="relative z-10">
          <h2 style={{ fontFamily:'Georgia,serif',fontSize:42,fontWeight:700,color:'#f0ede6',lineHeight:1.15,marginBottom:20 }}>
            Cada refeição<br />
            <em style={{ fontStyle:'italic',color:'#1D9E75' }}>transforma</em><br />
            uma vida.
          </h2>
          <p style={{ fontSize:15,color:'rgba(240,237,230,0.45)',fontWeight:300,lineHeight:1.7,maxWidth:380 }}>
            Junte-se aos voluntários que organizam a distribuição de alimentos para pessoas em situação de vulnerabilidade no centro de São Paulo.
          </p>
          <div className="flex gap-8 mt-10">
            {[{num:'3.842',label:'Refeições/mês'},{num:'641',label:'Beneficiários'},{num:'7',label:'Pontos ativos'}].map(({num,label})=>(
              <div key={label}>
                <div style={{ fontSize:26,fontWeight:500,color:'#1D9E75' }}>{num}</div>
                <div style={{ fontSize:11,color:'rgba(240,237,230,0.35)',marginTop:2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize:12,color:'rgba(240,237,230,0.2)',position:'relative',zIndex:10 }}>
          © 2026 Alimentar SP · Projeto social
        </p>
      </div>

      {/* Lado direito formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:'#1D9E75' }}>
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-medium text-gray-900">Alimentar SP</span>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            {mode === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}
          </h1>
          <p className="text-sm text-gray-400 mb-8">
            {mode === 'login' ? 'Entre para acessar o sistema da ONG' : 'Cadastre-se para começar como voluntário'}
          </p>

          <div className="flex flex-col gap-3 mb-6">
            {providers.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => handleOAuth(id)}
                disabled={!!oauthLoading}
                className="w-full flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {oauthLoading === id
                  ? <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  : icon}
                {oauthLoading === id ? 'Conectando...' : `Continuar com ${label}`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">ou use seu email</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {error && <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
          {success && <div className="bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">{success}</div>}

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block font-medium">Nome completo</label>
                <input type="text" required className="input" placeholder="Seu nome" value={nome} onChange={e=>setNome(e.target.value)} />
              </div>
            )}
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block font-medium">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="email" required className="input pl-9" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block font-medium">Senha</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type={showPass?'text':'password'} required className="input pl-9 pr-10" placeholder="••••••••" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} />
                <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50" style={{ background:'#1D9E75' }}>
              {loading ? 'Aguarde...' : <>{mode==='login'?'Entrar':'Criar conta'}<ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            {mode==='login'?'Ainda não tem conta?':'Já tem uma conta?'}{' '}
            <button onClick={()=>{setMode(mode==='login'?'register':'login');setError('');setSuccess('')}} className="font-medium" style={{color:'#1D9E75'}}>
              {mode==='login'?'Criar conta':'Entrar'}
            </button>
          </p>
          <p className="text-center text-xs text-gray-300 mt-4">
            <Link href="/" className="hover:text-gray-500 transition-colors">← Voltar para o início</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
