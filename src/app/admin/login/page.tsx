'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  const handleLogin = async () => {
    setError('')
    if (!form.email || !form.password) {
      setError('Remplissez tous les champs.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Erreur de connexion')
        return
      }
      router.push('/admin')
    } catch {
      setError('Erreur reseau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-light flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-gradient">skeu</h1>
          <p className="text-gray-400 text-sm mt-1">Administration</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="admin@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-violet-400 transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="........"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-violet-400 transition-colors pr-10"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="btn-primary w-full mt-6 flex items-center justify-center gap-2 text-sm"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Connexion...</> : 'Se connecter'}
        </button>
        <p className="text-xs text-center text-gray-500 mt-4">
          Si vous n&apos;avez pas encore de compte admin, inscrivez-vous d&apos;abord sur <span className="font-semibold">/login</span> avec l&apos;email defini dans <span className="font-semibold">ADMIN_EMAIL</span>.
        </p>

      </div>
    </div>
  )
}
