'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import CartSidebar from '@/components/shop/CartSidebar'
import { Loader2, LogOut, ShieldCheck, UserRound } from 'lucide-react'

type SessionUser = {
  name: string
  email: string
  phone?: string
  role: 'customer' | 'admin'
}

const emptyRegister = { name: '', email: '', phone: '', password: '' }
const emptyLogin = { email: '', password: '' }

export default function AccountPage() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [registerForm, setRegisterForm] = useState(emptyRegister)
  const [loginForm, setLoginForm] = useState(emptyLogin)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [submitting, setSubmitting] = useState<'register' | 'login' | null>(null)

  const loadSession = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/account', { cache: 'no-store' })
      const data = await res.json()
      setUser(data.user || null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSession()
  }, [])

  const submitAccountAction = async (action: 'register' | 'login') => {
    setSubmitting(action)
    setMessage(null)
    const payload =
      action === 'register'
        ? { action, ...registerForm }
        : { action, ...loginForm }

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
      await loadSession()
    } catch {
      setMessage({ type: 'err', text: 'Erreur reseau. Reessayez.' })
    } finally {
      setSubmitting(null)
    }
  }

  const logout = async () => {
    await fetch('/api/account', { method: 'DELETE' })
    setUser(null)
    setMessage({ type: 'ok', text: 'Vous etes deconnecte.' })
  }

  return (
    <>
      <Navbar />
      <CartSidebar />
      <main className="min-h-screen bg-gradient-to-b from-violet-50/60 to-white pb-28 md:pb-10">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-2xl mb-10">
            <h1 className="font-display text-4xl sm:text-5xl font-light mb-3">
              Mon <span className="text-gradient font-semibold italic">compte</span>
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Creez votre compte si vous etes nouveau. Si vous avez deja un compte, connectez-vous pour voir vos informations et vous deconnecter.
            </p>
          </div>

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

          {loading ? (
            <div className="flex items-center justify-center py-24 text-violet-600">
              <Loader2 className="animate-spin" size={28} />
            </div>
          ) : user ? (
            <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-6">
              <div className="bg-white border border-violet-100 rounded-[32px] p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center text-white">
                    {user.role === 'admin' ? <ShieldCheck size={24} /> : <UserRound size={24} />}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-violet-500 font-semibold">
                      {user.role === 'admin' ? 'Administrateur' : 'Client'}
                    </p>
                    <h2 className="font-display text-3xl text-gray-900">{user.name}</h2>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-violet-50 px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-violet-500 font-semibold mb-1">Email</p>
                    <p className="text-gray-800 font-medium break-all">{user.email}</p>
                  </div>
                  <div className="rounded-2xl bg-violet-50 px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-violet-500 font-semibold mb-1">Telephone</p>
                    <p className="text-gray-800 font-medium">{user.phone || 'Non renseigne'}</p>
                  </div>
                  <div className="rounded-2xl bg-violet-50 px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-violet-500 font-semibold mb-1">Statut</p>
                    <p className="text-gray-800 font-medium">Connecte</p>
                  </div>
                  <div className="rounded-2xl bg-violet-50 px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-violet-500 font-semibold mb-1">Acces</p>
                    <p className="text-gray-800 font-medium">{user.role === 'admin' ? 'Dashboard admin' : 'Espace client'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-8">
                  {user.role === 'admin' && (
                    <Link href="/admin" className="btn-primary text-sm">
                      Ouvrir le dashboard admin
                    </Link>
                  )}
                  <button onClick={logout} className="btn-outline text-sm inline-flex items-center gap-2">
                    <LogOut size={16} />
                    Deconnexion
                  </button>
                </div>
              </div>

              <div className="bg-white border border-violet-100 rounded-[32px] p-8 shadow-sm">
                <h3 className="font-display text-3xl mb-3">Acces rapide</h3>
                <div className="space-y-3 text-sm text-gray-500">
                  <p>Votre session est active et securisee par cookie httpOnly.</p>
                  <p>Les comptes clients sont sauvegardes dans MongoDB.</p>
                  <p>L&apos;administrateur peut aussi se connecter depuis cette page puis acceder au dashboard.</p>
                </div>
                <div className="mt-6 space-y-3">
                  <Link href="/products" className="btn-primary text-sm inline-block w-full text-center">
                    Voir les produits
                  </Link>
                  <Link href="/wishlist" className="btn-outline text-sm inline-block w-full text-center">
                    Voir ma wishlist
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white border border-violet-100 rounded-[32px] p-8 shadow-sm">
                <h2 className="font-display text-3xl mb-2">S&apos;inscrire</h2>
                <p className="text-gray-500 text-sm mb-6">Creez votre compte client pour acceder a votre espace personnel.</p>
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
                </div>
              </div>

              <div className="bg-white border border-violet-100 rounded-[32px] p-8 shadow-sm">
                <h2 className="font-display text-3xl mb-2">Se connecter</h2>
                <p className="text-gray-500 text-sm mb-6">Connectez-vous si vous avez deja un compte. L&apos;admin peut aussi se connecter ici.</p>
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
                    className="btn-outline w-full text-sm inline-flex items-center justify-center gap-2"
                  >
                    {submitting === 'login' ? <Loader2 size={16} className="animate-spin" /> : null}
                    Se connecter
                  </button>
                </div>
                <div className="mt-6 rounded-2xl bg-violet-50 px-4 py-4 text-xs text-violet-700">
                  Admin par defaut : admin@skeucosmetique.com / Admin@2024!
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
