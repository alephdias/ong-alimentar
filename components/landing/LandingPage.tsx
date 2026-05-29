'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, Play, UserCheck, ClipboardList,
  BarChart2, Heart, MapPin, Users, Package, Utensils
} from 'lucide-react'

function useInView(ref: React.RefObject<Element>, threshold = 0.15) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref, threshold])
  return visible
}

function AnimatedSection({ children, className = '', delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref)
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function CountUp({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const visible = useInView(ref)

  useEffect(() => {
    if (!visible) return
    const duration = 1800
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + increment, target)
      setVal(Math.round(current))
      if (current >= target) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [visible, target])

  return <span ref={ref}>{prefix}{val.toLocaleString('pt-BR')}{suffix}</span>
}

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", background: '#0a0a0a', color: '#f0ede6', minHeight: '100vh' }}>

      {/* ——— NAV ——— */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 60px', borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        position: 'sticky', top: 0, background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(12px)', zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 10, height: 10, borderRadius: '50%', background: '#1D9E75',
            display: 'inline-block', animation: 'pulse 2s infinite',
          }} />
          <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '0.02em' }}>Alimentar SP</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {['Sobre', 'Como funciona', 'Impacto'].map(label => (
            <a key={label} href={`#${label.toLowerCase().replace(' ', '-')}`} style={{
              fontSize: 13, padding: '7px 16px', border: '0.5px solid rgba(255,255,255,0.15)',
              borderRadius: 99, color: 'rgba(240,237,230,0.7)', background: 'transparent',
              textDecoration: 'none', transition: 'background 0.2s',
            }}>
              {label}
            </a>
          ))}
          <Link href="/login" style={{
            fontSize: 13, padding: '8px 20px',
            background: '#1D9E75', color: '#fff', borderRadius: 8,
            textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            Acessar sistema <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ——— HERO ——— */}
      <section style={{ padding: '100px 60px 72px', maxWidth: 1200, margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 11, fontWeight: 500, letterSpacing: '0.09em', textTransform: 'uppercase',
            color: '#1D9E75', border: '0.5px solid rgba(29,158,117,0.35)',
            padding: '6px 16px', borderRadius: 99, marginBottom: 32,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#1D9E75', display: 'inline-block' }} />
            ONG · Centro de São Paulo · Desde 2021
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(52px, 7vw, 88px)',
            lineHeight: 1.0, fontWeight: 700, marginBottom: 0, color: '#f0ede6',
          }}>
            Nenhum prato<br />
            <em style={{ fontStyle: 'italic', color: '#1D9E75' }}>vazio</em> na cidade.
          </h1>

          <p style={{
            fontSize: 17, fontWeight: 300, color: 'rgba(240,237,230,0.5)',
            maxWidth: 500, lineHeight: 1.7, marginTop: 28, marginBottom: 44,
          }}>
            O Alimentar SP organiza voluntários, controla estoques e registra cada refeição entregue para quem mais precisa nas ruas do centro de São Paulo.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link href="/login" style={{
              background: '#1D9E75', color: '#fff', border: 'none',
              borderRadius: 10, padding: '15px 32px', fontSize: 15, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
            }}>
              <ArrowRight size={16} /> Acessar o sistema
            </Link>
            <a href="#sobre" style={{
              background: 'transparent', color: 'rgba(240,237,230,0.55)',
              border: 'none', fontSize: 14, display: 'flex', alignItems: 'center',
              gap: 6, cursor: 'pointer', textDecoration: 'none',
            }}>
              <Play size={14} /> Saiba mais
            </a>
          </div>
        </AnimatedSection>

        {/* Ticker de stats */}
        <AnimatedSection delay={200}>
          <div style={{
            marginTop: 72, borderTop: '0.5px solid rgba(255,255,255,0.08)',
            paddingTop: 40, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          }}>
            {[
              { num: 3842, label: 'Refeições este mês' },
              { num: 641, label: 'Pessoas atendidas' },
              { num: 7, label: 'Pontos de distribuição', suffix: '' },
              { num: 23, label: 'Voluntários ativos' },
            ].map(({ num, label, suffix = '' }, i) => (
              <div key={label} style={{
                paddingRight: i < 3 ? 32 : 0,
                paddingLeft: i > 0 ? 32 : 0,
                borderRight: i < 3 ? '0.5px solid rgba(255,255,255,0.08)' : 'none',
              }}>
                <div style={{ fontSize: 44, fontWeight: 500, color: '#f0ede6', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  <CountUp target={num} suffix={suffix} />
                </div>
                <div style={{ fontSize: 12, color: 'rgba(240,237,230,0.35)', marginTop: 8, fontWeight: 300 }}>{label}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ——— SOBRE / A CAUSA ——— */}
      <section id="sobre" style={{ padding: '80px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#1D9E75', marginBottom: 24 }}>
            A causa
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
            border: '0.5px solid rgba(255,255,255,0.09)', borderRadius: 16, overflow: 'hidden',
          }}>
            <div style={{ padding: 48, borderRight: '0.5px solid rgba(255,255,255,0.09)' }}>
              <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 38, lineHeight: 1.2, fontWeight: 700, color: '#f0ede6', marginBottom: 20,
              }}>
                São Paulo tem fome.<br />
                A gente tem <em style={{ fontStyle: 'italic', color: '#1D9E75' }}>solução</em>.
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(240,237,230,0.48)', fontWeight: 300 }}>
                O centro de São Paulo concentra uma das maiores populações em situação de rua do Brasil. São pessoas com histórias, que enfrentam diariamente a insegurança alimentar — sem saber se terão o próximo prato.
              </p>
              <div style={{
                marginTop: 32, padding: 24,
                background: 'rgba(29,158,117,0.07)',
                border: '0.5px solid rgba(29,158,117,0.2)', borderRadius: 12,
              }}>
                <div style={{ fontSize: 48, fontWeight: 500, color: '#1D9E75', letterSpacing: '-0.03em' }}>
                  <CountUp target={31884} />
                </div>
                <div style={{ fontSize: 13, color: 'rgba(240,237,230,0.4)', marginTop: 6, fontWeight: 300 }}>
                  pessoas em situação de rua em São Paulo (Censo 2023)
                </div>
              </div>
            </div>
            <div style={{ padding: 48, background: 'rgba(255,255,255,0.015)' }}>
              <h3 style={{ fontSize: 14, fontWeight: 500, color: 'rgba(240,237,230,0.6)', marginBottom: 24 }}>
                O que fazemos na prática
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 18 }}>
                {[
                  { icon: Utensils, text: 'Distribuição diária de refeições quentes em pontos estratégicos do centro' },
                  { icon: Users, text: 'Cadastro e acompanhamento de beneficiários para entender cada história' },
                  { icon: Package, text: 'Gestão de estoque para garantir que nunca falte insumo nas distribuições' },
                  { icon: UserCheck, text: 'Organização de voluntários com acesso seguro ao sistema de gestão' },
                  { icon: BarChart2, text: 'Relatórios de impacto para transparência com parceiros e doadores' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      border: '0.5px solid rgba(29,158,117,0.3)',
                      background: 'rgba(29,158,117,0.07)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
                    }}>
                      <Icon size={13} color="#1D9E75" />
                    </div>
                    <span style={{ fontSize: 14, color: 'rgba(240,237,230,0.55)', lineHeight: 1.6, fontWeight: 300 }}>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ——— COMO FUNCIONA ——— */}
      <section id="como-funciona" style={{ padding: '0 60px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#1D9E75', marginBottom: 24 }}>
            Como funciona
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            border: '0.5px solid rgba(255,255,255,0.09)', borderRadius: 16, overflow: 'hidden',
          }}>
            {[
              {
                n: '01', icon: UserCheck,
                title: 'Voluntário entra com Google',
                desc: 'Acesso restrito por email cadastrado. Apenas voluntários autorizados pelo admin entram no sistema com um clique — sem senha, sem burocracia.',
              },
              {
                n: '02', icon: ClipboardList,
                title: 'Registra cada distribuição',
                desc: 'Local, data, número de refeições servidas e observações. Tudo fica salvo em tempo real no banco de dados seguro na nuvem.',
              },
              {
                n: '03', icon: BarChart2,
                title: 'Acompanha o impacto',
                desc: 'Dashboard com estatísticas do mês, alertas de estoque baixo e histórico completo das ações realizadas pela equipe.',
              },
            ].map(({ n, icon: Icon, title, desc }, i) => (
              <div key={n} style={{
                padding: '44px 36px', position: 'relative',
                borderRight: i < 2 ? '0.5px solid rgba(255,255,255,0.09)' : 'none',
              }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 100, fontWeight: 700,
                  color: 'rgba(255,255,255,0.03)',
                  position: 'absolute', top: 12, right: 20, lineHeight: 1,
                }}>
                  {n}
                </div>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  border: '0.5px solid rgba(29,158,117,0.35)',
                  background: 'rgba(29,158,117,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 24,
                }}>
                  <Icon size={20} color="#1D9E75" />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 500, color: '#f0ede6', marginBottom: 12 }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(240,237,230,0.42)', lineHeight: 1.7, fontWeight: 300 }}>{desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ——— IMPACTO ——— */}
      <section id="impacto" style={{
        background: 'rgba(29,158,117,0.05)',
        borderTop: '0.5px solid rgba(29,158,117,0.14)',
        borderBottom: '0.5px solid rgba(29,158,117,0.14)',
        padding: '64px 60px',
      }}>
        <AnimatedSection>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#1D9E75', marginBottom: 40 }}>
              Nosso impacto
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {[
                { num: 46000, prefix: '+', suffix: '', label: 'Refeições distribuídas desde o início' },
                { num: 1200, prefix: '', suffix: '+', label: 'Pessoas únicas atendidas' },
                { num: 365, prefix: '', suffix: '', label: 'Dias por ano em operação' },
                { num: 0, prefix: 'R$ ', suffix: '', label: 'Custo de tecnologia (tudo gratuito)' },
              ].map(({ num, prefix, suffix, label }, i) => (
                <div key={label} style={{
                  padding: '0 36px',
                  borderRight: i < 3 ? '0.5px solid rgba(29,158,117,0.12)' : 'none',
                  paddingLeft: i === 0 ? 0 : 36,
                }}>
                  <div style={{ fontSize: 50, fontWeight: 500, color: '#1D9E75', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    <CountUp target={num} prefix={prefix} suffix={suffix} />
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(240,237,230,0.38)', marginTop: 10, fontWeight: 300, lineHeight: 1.5 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ——— PONTOS DE DISTRIBUIÇÃO ——— */}
      <section style={{ padding: '80px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#1D9E75', marginBottom: 24 }}>
            Pontos de distribuição
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { local: 'Praça da Sé', freq: 'Diário · 11h30', ref: '127 refeições/dia' },
              { local: 'Luz — R. dos Andradas', freq: 'Seg, Qua, Sex · 18h', ref: '98 refeições/dia' },
              { local: 'Brás — Av. Rangel Pestana', freq: 'Diário · 12h', ref: '210 refeições/dia' },
              { local: 'Al. Dino Bueno', freq: 'Diário · 19h', ref: '183 refeições/dia' },
              { local: 'Pq. D. Pedro II', freq: 'Ter, Qui, Sáb · 12h30', ref: '95 refeições/dia' },
              { local: 'Liberdade — Pça. da Liberdade', freq: 'Qua, Sáb · 11h', ref: '70 refeições/dia' },
              { local: 'Glicério — R. do Glicério', freq: 'Seg a Sex · 13h', ref: '120 refeições/dia' },
            ].map(({ local, freq, ref }) => (
              <div key={local} style={{
                padding: '20px 20px', border: '0.5px solid rgba(255,255,255,0.07)',
                borderRadius: 12, background: 'rgba(255,255,255,0.015)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <MapPin size={13} color="#1D9E75" />
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#f0ede6' }}>{local}</span>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(240,237,230,0.35)', marginBottom: 6, fontWeight: 300 }}>{freq}</div>
                <div style={{ fontSize: 12, color: '#1D9E75', fontWeight: 500 }}>{ref}</div>
              </div>
            ))}
            <div style={{
              padding: '20px', border: '0.5px solid rgba(29,158,117,0.25)',
              borderRadius: 12, background: 'rgba(29,158,117,0.05)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              textAlign: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 28, fontWeight: 500, color: '#1D9E75' }}>+7</span>
              <span style={{ fontSize: 11, color: 'rgba(240,237,230,0.35)', fontWeight: 300 }}>em expansão</span>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ——— DEPOIMENTOS ——— */}
      <section style={{ padding: '0 60px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#1D9E75', marginBottom: 24 }}>
            Vozes da ONG
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              {
                texto: '"Antes usávamos planilhas bagunçadas. Agora sei exatamente quantas refeições saíram, quem foi o voluntário e quanto resta no estoque. Mudou tudo."',
                nome: 'Carlos Mendes', cargo: 'Coordenador de operações', inicial: 'CM',
              },
              {
                texto: '"O login com Google foi um divisor de águas. Qualquer voluntário acessa sem precisar lembrar senha. E o admin controla quem pode entrar."',
                nome: 'Letícia Ferraz', cargo: 'Voluntária há 2 anos', inicial: 'LF',
              },
            ].map(({ texto, nome, cargo, inicial }) => (
              <div key={nome} style={{
                padding: 36, border: '0.5px solid rgba(255,255,255,0.07)',
                borderRadius: 16, background: 'rgba(255,255,255,0.02)',
              }}>
                <p style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 18, lineHeight: 1.65, color: 'rgba(240,237,230,0.78)',
                  fontStyle: 'italic', marginBottom: 28,
                }}>
                  {texto}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'rgba(29,158,117,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 500, color: '#1D9E75',
                  }}>{inicial}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#f0ede6' }}>{nome}</div>
                    <div style={{ fontSize: 11, color: 'rgba(240,237,230,0.32)', marginTop: 2 }}>{cargo}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ——— CTA FINAL ——— */}
      <section style={{
        padding: '100px 60px',
        borderTop: '0.5px solid rgba(255,255,255,0.07)',
        textAlign: 'center',
      }}>
        <AnimatedSection>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(40px, 5vw, 64px)',
            fontWeight: 700, color: '#f0ede6', lineHeight: 1.1, marginBottom: 20,
          }}>
            Pronto para<br />
            <em style={{ fontStyle: 'italic', color: '#1D9E75' }}>fazer diferença</em>?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(240,237,230,0.42)', fontWeight: 300, marginBottom: 44 }}>
            Acesse o sistema com sua conta Google autorizada e comece a registrar as ações da ONG.
          </p>
          <Link href="/login" style={{
            background: '#1D9E75', color: '#fff', borderRadius: 12,
            padding: '18px 48px', fontSize: 16, fontWeight: 500,
            display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none',
          }}>
            <Heart size={16} /> Entrar no sistema
          </Link>
        </AnimatedSection>
      </section>

      {/* ——— FOOTER ——— */}
      <footer style={{
        padding: '24px 60px', borderTop: '0.5px solid rgba(255,255,255,0.05)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <p style={{ fontSize: 12, color: 'rgba(240,237,230,0.18)' }}>
          © 2026 Alimentar SP — Todos os direitos reservados
        </p>
        <p style={{ fontSize: 12, color: 'rgba(240,237,230,0.18)' }}>
          Desenvolvido para fins sociais · Projeto acadêmico
        </p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
        a:hover { opacity: 0.85; }
        * { -webkit-font-smoothing: antialiased; }
      `}</style>
    </div>
  )
}
