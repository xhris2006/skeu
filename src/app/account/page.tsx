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

export default function AccountPage() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

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

  const logout = async () => {
    await fetch('/api/account', { method: 'DELETE' })
    setUser(null)
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
              Consultez votre profil quand vous etes connecte. Sinon, utilisez le bouton de connexion.
            </p>
          </div>

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
                  <p>Les comptes sont sauvegardes dans MongoDB.</p>
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
            <div className="max-w-xl bg-white border border-violet-100 rounded-[32px] p-8 shadow-sm">
              <h2 className="font-display text-3xl mb-3">Connexion requise</h2>
              <p className="text-gray-500 text-sm mb-6">
                Vous n&apos;etes pas connecte. Cliquez sur le bouton ci-dessous pour acceder a la page de connexion et d&apos;inscription.
              </p>
              <Link href="/login" className="btn-primary inline-flex items-center justify-center text-sm px-6">
                Se connecter
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
