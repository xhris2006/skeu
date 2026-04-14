'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import CartSidebar from '@/components/shop/CartSidebar'
import { Loader2 } from 'lucide-react'

const emptyRegister = { name: '', email: '', phone: '', password: '' }
const emptyLogin = { email: '', password: '' }

type Mode = 'login' | 'register'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [registerForm, setRegisterForm] = useState(emptyRegister)
  const [loginForm, setLoginForm] = useState(emptyLogin)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [submitting, setSubmitting] = useState<'register' | 'login' | null>(null)

  const submitAccountAction = async (action: 'register' | 'login') => {
    setSubmitting(action)
    setMessage(null)
    const payload = action === 'register' ? { action, ...registerForm } : { action, ...loginForm }

    try {
      const res = await fetch('/api/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'err', text: data.error || 'Une erreur est survenue.' })
        return
      }

      if (action === 'register') setRegisterForm(emptyRegister)
      if (action === 'login') setLoginForm(emptyLogin)

      setMessage({
        type: 'ok',
        text: action === 'register' ? 'Compte cree avec succes.' : 'Connexion reussie.',
      })

      router.push('/account')
      router.refresh()
    } catch {
      setMessage({ type: 'err', text: 'Erreur reseau. Reessayez.' })
    } finally {
      setSubmitting(null)
    }
  }

  return (
    <>
      <Navbar />
      <CartSidebar />
      <main className="min-h-screen bg-gradient-to-b from-violet-50/60 to-white pb-28 md:pb-10">
        <section className="max-w-xl mx-auto px-4 sm:px-6 py-14">
          <div className="bg-white border border-violet-100 rounded-[32px] p-8 shadow-sm">
            <h1 className="font-display text-4xl font-light mb-2">
              {mode === 'login' ? 'Se connecter' : 'S\'inscrire'}
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              {mode === 'login'
                ? 'Connectez-vous pour acceder a votre compte.'
                : 'Creez votre compte si vous etes nouveau.'}
            </p>

            {message && (
              <div
                className={`mb-6 rounded-2xl px-4 py-3 text-sm border ${
                  message.type === 'ok'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-600'
                }`}
              >
                {message.text}
              </div>
            )}

            {mode === 'login' ? (
              <div className="space-y-4">
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-violet-400"
                />
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Mot de passe"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-violet-400"
                />
                <button
                  onClick={() => submitAccountAction('login')}
                  disabled={submitting !== null}
                  className="btn-primary w-full text-sm inline-flex items-center justify-center gap-2"
                >
                  {submitting === 'login' ? <Loader2 size={16} className="animate-spin" /> : null}
                  Se connecter
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('register')
                    setMessage(null)
                  }}
                  className="btn-outline w-full text-sm"
                >
                  Je n&apos;ai pas de compte, s&apos;inscrire
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom complet"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-violet-400"
                />
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-violet-400"
                />
                <input
                  type="text"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Telephone"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-violet-400"
                />
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Mot de passe"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-violet-400"
                />
                <button
                  onClick={() => submitAccountAction('register')}
                  disabled={submitting !== null}
                  className="btn-primary w-full text-sm inline-flex items-center justify-center gap-2"
                >
                  {submitting === 'register' ? <Loader2 size={16} className="animate-spin" /> : null}
                  Creer un compte
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('login')
                    setMessage(null)
                  }}
                  className="btn-outline w-full text-sm"
                >
                  J&apos;ai deja un compte, se connecter
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
