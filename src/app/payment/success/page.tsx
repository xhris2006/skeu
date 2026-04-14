'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Loader2, XCircle, MessageCircle } from 'lucide-react'
import Link from 'next/link'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const transId      = searchParams.get('transId')
  const orderNum     = searchParams.get('order')

  const [status,  setStatus]  = useState<'checking' | 'success' | 'pending' | 'failed'>('checking')
  const [waLink,  setWaLink]  = useState('')

  useEffect(() => {
    if (!transId) { setStatus('pending'); return }
    fetch(`/api/payment/status?transId=${transId}`)
      .then(r => r.json())
      .then(d => {
        if (d.status === 'SUCCESSFUL') setStatus('success')
        else if (d.status === 'FAILED' || d.status === 'EXPIRED') setStatus('failed')
        else setStatus('pending')
        if (d.waLink) setWaLink(d.waLink)
      })
      .catch(() => setStatus('pending'))
  }, [transId])

  return (
    <div className="min-h-screen gradient-light flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full text-center">
        {status === 'checking' && (
          <>
            <Loader2 size={48} className="text-violet-500 animate-spin mx-auto mb-4" />
            <h2 className="font-display text-2xl font-light">Vérification du paiement…</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
            <h2 className="font-display text-3xl font-light mb-2 text-green-700">Paiement réussi !</h2>
            <p className="text-gray-500 text-sm mb-6">
              Merci ! Votre commande <strong>{orderNum}</strong> a été confirmée.
            </p>
            {waLink && (
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-medium px-6 py-3 rounded-full text-sm transition-colors shadow-md mb-4 w-full justify-center">
                <MessageCircle size={18} /> Contacter sur WhatsApp
              </a>
            )}
            <Link href="/" className="block text-sm text-violet-500 hover:text-violet-700 mt-3">← Retour à l'accueil</Link>
          </>
        )}

        {status === 'pending' && (
          <>
            <div className="text-5xl mb-4">⏳</div>
            <h2 className="font-display text-2xl font-light mb-2">Paiement en attente</h2>
            <p className="text-gray-500 text-sm mb-6">
              Votre paiement est en cours de traitement. Vous recevrez une confirmation rapidement.
            </p>
            {waLink && (
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 text-white font-medium px-6 py-3 rounded-full text-sm mb-4 w-full justify-center">
                <MessageCircle size={18} /> Confirmer sur WhatsApp
              </a>
            )}
            <Link href="/" className="block text-sm text-violet-500 hover:text-violet-700">← Retour à l'accueil</Link>
          </>
        )}

        {status === 'failed' && (
          <>
            <XCircle size={56} className="text-red-400 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-light mb-2 text-red-600">Paiement échoué</h2>
            <p className="text-gray-500 text-sm mb-6">Le paiement a échoué ou a expiré. Réessayez.</p>
            <Link href="/checkout" className="btn-primary text-sm inline-block">Réessayer</Link>
          </>
        )}
      </div>
    </div>
  )
}

function PaymentSuccessFallback() {
  return (
    <div className="min-h-screen gradient-light flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full text-center">
        <Loader2 size={48} className="text-violet-500 animate-spin mx-auto mb-4" />
        <h2 className="font-display text-2xl font-light">Chargement…</h2>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
